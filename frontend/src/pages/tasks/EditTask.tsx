import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

// react-query hooks.
import { useUsers } from "@/api/users";
import { useTask, useUpdateTask } from "@/api/tasks";

// types.
import { TaskFormInputs } from "@/components/tasks/TaskForm";

// components
import TaskForm from "@/components/tasks/TaskForm";

const EditTask = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const { data: users, isLoading: usersLoading } = useUsers();
  const {
    data: task,
    isLoading: taskLoading,
    isError,
    error,
  } = useTask(taskId!);

  const { mutateAsync: updateTask } = useUpdateTask();

  const isLoading = taskLoading || usersLoading;

  let errorMessage = "Something went wrong!";
  if (isAxiosError(error)) {
    if (error.code === "ERR_NETWORK") {
      errorMessage = "Network connection error";
    } else {
      errorMessage = error.response?.data?.message || errorMessage;
    }
  }

  const values: TaskFormInputs = task
    ? {
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: new Date(task.dueDate),
        assignedUser: task?.assignedUser?.userId ?? "",
      }
    : {
        title: "",
        description: "",
        status: "PENDING" as any,
        dueDate: new Date(),
        assignedUser: "",
      };

  const onSubmit = async (data: TaskFormInputs) => {
    if (!task) return;

    updateTask(
      { taskId: task.taskId, data },
      {
        onSuccess: () => {
          toast.success("Task updated successfully");
          navigate(-1);
        },
        onError: (err) => {
          let message = "Task update failed";

          if (isAxiosError(err)) {
            if (err.code === "ERR_NETWORK") {
              message = "Network connection error";
            } else {
              message = err.response?.data?.message || message;
            }
          }

          toast.error(message);
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Edit Task</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Go Back</span>
        </button>
      </div>

      {isLoading && (
        <div className="w-full overflow-x-auto">
          <div className="overflow-hidden rounded border border-gray-700 bg-gray-900 p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-800 rounded animate-pulse"></div>
              </div>

              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-24 w-full bg-gray-800 rounded animate-pulse"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-800 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-800 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-800 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="h-10 w-full bg-gray-800 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && isError && (
        <div className="w-full overflow-x-auto">
          <div className="overflow-hidden rounded border border-gray-700 bg-gray-900 p-6">
            <div className="text-center text-red-400 py-12">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <div className="text-lg font-medium mb-2">{errorMessage}</div>
              <p className="text-sm text-red-300">
                Please try refreshing the page or check your connection
              </p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !isError && !task && (
        <div className="w-full overflow-x-auto">
          <div className="overflow-hidden rounded border border-gray-700 bg-gray-900 p-6">
            <div className="text-center text-gray-400 py-12">
              Task not found
            </div>
          </div>
        </div>
      )}

      {!isLoading && !isError && task && (
        <div className="w-full overflow-x-auto">
          <div className="overflow-hidden rounded border border-gray-700 bg-gray-900 p-6">
            <TaskForm
              users={users}
              values={values}
              onSubmit={onSubmit}
              createdBy={task.createdBy}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTask;
