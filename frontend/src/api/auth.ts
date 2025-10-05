import { useMutation } from "@tanstack/react-query";

// axios instance.
import axios from "@/lib/axios";

// types.
import { User } from "@/types/user";
import { LoginFormInputs } from "@/components/auth/LoginForm";
import { RegisterFormInputs } from "@/components/auth/RegisterForm";

// type definitions.
type RegisterResponse = {
  message: string;
};

type LoginResponse = {
  user: User;
  token: string;
  message: string;
};

// login.
export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginFormInputs) => {
      const res = await axios.post<LoginResponse>("/auth/login", data);
      return res.data;
    },
  });
};

// register.
export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterFormInputs) => {
      const res = await axios.post<RegisterResponse>("/auth/register", data);
      return res.data;
    },
  });
};
