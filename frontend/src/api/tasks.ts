import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// axios instance.
import axios from "@/lib/axios";

// types.
import { Task } from "@/types/task";
import { Status } from "@/types/task";
import { TaskFormInputs } from "@/components/tasks/TaskForm";

type TasksQueryParams = {
  search?: string;
  status?: Status | "All";
};

// fetch all tasks.
export const useTasks = (queryParams?: TasksQueryParams) => {
  return useQuery({
    queryKey: ["tasks", queryParams],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (queryParams?.search) {
        params.append("search", queryParams.search);
      }

      if (queryParams?.status && queryParams.status !== "All") {
        params.append("status", queryParams.status);
      }

      const queryString = params.toString();
      const url = queryString ? `/tasks?${queryString}` : "/tasks";

      const res = await axios.get<Task[]>(url);
      return res.data;
    },
  });
};

// fetch single task by taskId.
export const useTask = (taskId: string) => {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: async () => {
      const res = await axios.get<Task>(`/tasks/${taskId}`);
      return res.data;
    },
    enabled: !!taskId,
  });
};

// create a new task.
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TaskFormInputs) => {
      const payload = {
        ...data,
        dueDate: data.dueDate.toISOString(),
      };
      const res = await axios.post("/tasks", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

// update a task.
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      taskId,
    }: {
      taskId: string;
      data: TaskFormInputs;
    }) => {
      const payload = {
        ...data,
        dueDate: data.dueDate.toISOString(),
      };
      const res = await axios.patch(`/tasks/${taskId}`, payload);
      return res.data;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
    },
  });
};

// delete a task.
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const res = await axios.delete(`/tasks/${taskId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
