import { useQuery } from "@tanstack/react-query";

// axios instance.
import axios from "@/lib/axios";

// types.
import { User } from "@/types/user";

// fetch all users.
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get<User[]>("/users");
      return res.data;
    },
  });
};


