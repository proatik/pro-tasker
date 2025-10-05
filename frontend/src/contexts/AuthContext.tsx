import { ReactNode } from "react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useState, useContext, createContext, useEffect } from "react";

// react-query hooks.
import { useLogin, useRegister } from "@/api/auth";

// types
import { User } from "@/types/user";
import { LoginFormInputs } from "@/components/auth/LoginForm";
import { RegisterFormInputs } from "@/components/auth/RegisterForm";

// type definitions.
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  logout: () => void;
  login: (data: LoginFormInputs) => Promise<void>;
  register: (data: RegisterFormInputs) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const login = async (data: LoginFormInputs) => {
    try {
      const { user, token, message } = await loginMutation.mutateAsync(data);

      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(message);
    } catch (err) {
      let message = "Login failed";

      if (isAxiosError(err)) {
        if (err.code === "ERR_NETWORK") {
          message = "Network connection error";
        } else {
          message = err.response?.data?.message;
        }
      }

      toast.error(message);
    }
  };

  const register = async (data: RegisterFormInputs) => {
    try {
      const { message } = await registerMutation.mutateAsync(data);

      toast.success(message);
      return true;
    } catch (err) {
      let message = "Registration failed";

      if (isAxiosError(err)) {
        if (err.code === "ERR_NETWORK") {
          message = "Network connection error";
        } else {
          message = err.response?.data?.message;
        }
      }

      toast.error(message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logout successful");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    document.title = "Pro Tasker";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used inside AuthProvider");

  return context;
};
