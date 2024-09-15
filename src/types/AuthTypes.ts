export interface User {
  username: string;
  first_name: string;
  last_name: string;
}

export interface AuthContextType {
  user: User | null;
  userToken: string | null;
  loading: boolean;
  authError: string | null;
  login: (loginData: LoginData) => Promise<LoginResponse>;
  register: (userData: RegisterData) => Promise<RegisterResponse>;
  logout: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  initialState?: {
    user?: User | null;
    userToken?: string | null;
    error?: string | null;
    loading?: boolean;
  };
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: User;
  message?: string;
}
