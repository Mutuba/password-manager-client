// src/context/AuthContext.tsx
import { createContext, useState, useEffect, FC } from "react";
import axios from "axios";
import {
  AuthContextType,
  AuthProviderProps,
  User,
  LoginData,
  RegisterData,
} from "../types/AuthTypes";
import Spinner from "../components/Spinner";

const API_BASE_URL = import.meta.env.API_BASE_URL;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: FC<AuthProviderProps> = ({ children, initialState }) => {
  const [user, setUser] = useState<User | null>(initialState?.user ?? null);
  const [userToken, setUserToken] = useState<string | null>(
    initialState?.userToken ?? null
  );
  const [loading, setLoading] = useState<boolean>(
    initialState?.loading ?? true
  );

  // Effect to initialize authentication state from local storage
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
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData
      );
      const { auth_token, user } = response.data;

      localStorage.setItem("token", auth_token);
      setUserToken(auth_token);
      setUser(user);

      return {
        success: true,
        user,
        message: "Congratulations! Your account just got created",
      };
    } catch (error) {
      return {
        success: false,
        message: "An error occurred while registering.",
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (loginData: LoginData) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        loginData
      );
      const { auth_token, user } = response.data;

      localStorage.setItem("token", auth_token);
      setUserToken(auth_token);
      setUser(user);

      return { success: true, user, message: "Login successful" };
    } catch (error) {
      const message = "Login failed";
      return { success: false, message };
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
      value={{ user, userToken, loading, login, register, logout }}
    >
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Spinner size="100" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
