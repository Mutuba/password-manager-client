import { createContext, useState, useEffect, FC, useCallback } from "react";
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
  authError: null,
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
  const [authError, setAuthError] = useState<string | null>(
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

  const register = useCallback(async (userData: RegisterData) => {
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/sign_up`, {
        user: userData,
      });
      const { auth_token, user } = response.data;

      localStorage.setItem("token", auth_token);
      setUserToken(auth_token);
      setUser(user);

      return { success: true, user };
    } catch (error: any) {
      const message = error.response?.data?.error || "Registration failed";
      setAuthError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (loginData: LoginData) => {
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
      const message = error.response?.data?.error || "Login failed";
      setAuthError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setUserToken(null);
  }, []);

  if (loading) return <Spinner />;
  return (
    <AuthContext.Provider
      value={{ user, userToken, authError, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
