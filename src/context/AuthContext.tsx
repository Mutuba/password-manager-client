import { createContext, useState, useEffect, FC } from "react";
import axios from "axios";
import {
  AuthContextType,
  AuthProviderProps,
  User,
  LoginData,
  RegisterData,
} from "../types/AuthTypes";
import Spinner from "../shared/Spinner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext<AuthContextType>({
  user: null,
  userToken: null,
  error: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
});

const AuthProvider: FC<AuthProviderProps> = ({ children, initialState }) => {
  const [user, setUser] = useState<User | null>(initialState?.user ?? null);
  const [userToken, setUserToken] = useState<string | null>(
    initialState?.userToken ?? null
  );
  const [loading, setLoading] = useState<boolean>(
    initialState?.loading ?? true
  );

  const [error, setError] = useState<string | null>(
    initialState?.error ?? null
  );

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/auth/session`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { user } = response.data;

        setUserToken(token);
        setUser(user);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const register = async (userData: RegisterData) => {
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        user: userData,
      });
      const { auth_token, user } = response.data;

      localStorage.setItem("token", auth_token);
      setUserToken(auth_token);
      setUser(user);

      return { success: true, user };
    } catch (error) {
      const message = (error as any).response?.data?.error || "Login failed";
      setError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const login = async (loginData: LoginData) => {
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        user: loginData,
      });
      const { auth_token, user } = response.data;

      localStorage.setItem("token", auth_token);
      setUserToken(auth_token);
      setUser(user);

      return { success: true, user, message: "Login successful" };
    } catch (error: any) {
      setLoading(false);
      const message = (error as any).response?.data?.error || "Login failed";
      setError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setUserToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, userToken, error, loading, login, register, logout }}
    >
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-32 h-32">
            <Spinner />
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
