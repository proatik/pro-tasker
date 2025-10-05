import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// react-query hooks.
import { useUsers } from "@/api/users";
import { useCreateTask } from "@/api/tasks";

// types
import { TaskFormInputs } from "@/components/tasks/TaskForm";

// react components.
import TaskForm from "@/components/tasks/TaskForm";

const CreateTask = () => {
  const navigate = useNavigate();

  const { mutateAsync: createTask } = useCreateTask();
  const { data: users } = useUsers();

  const handleCreate = async (data: TaskFormInputs) => {
    createTask(data, {
      onSuccess: () => {
        navigate("/tasks");
        toast.success("Task created successfully");
      },
      onError: (err) => {
        let message = "Task create failed";

        if (isAxiosError(err)) {
          if (err.code === "ERR_NETWORK") {
            message = "Network connection error";
          } else {
            message = err.response?.data?.message || message;
          }
        }

        toast.error(message);
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Create Task</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Go Back</span>
        </button>
      </div>

      <TaskForm onSubmit={handleCreate} users={users} />
    </div>
  );
};

export default CreateTask;
