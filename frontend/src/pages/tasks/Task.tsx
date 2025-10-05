import { isAxiosError } from "axios";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

// react-query hook
import { useTask } from "@/api/tasks";

// react components.
import TaskDetails from "@/components/tasks/TaskDetails";

const Task = () => {
  const navigate = useNavigate();

  const { taskId } = useParams<{ taskId: string }>();
  const { data: task, isLoading, isError, error } = useTask(taskId!);

  let errorMessage = "Something went wrong!";

  if (isAxiosError(error)) {
    if (error.code === "ERR_NETWORK") {
      errorMessage = "Network connection error";
    } else {
      errorMessage = error.response?.data?.message || errorMessage;
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Task Details</h1>
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
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                <div className="h-6 w-full bg-gray-800 rounded animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
                <div className="h-6 w-full bg-gray-800 rounded animate-pulse" />
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-10 gap-4 text-sm text-gray-400">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-700 rounded-full animate-pulse" />
                    <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
                  </div>
                ))}
              </div>

              <div className="h-3 w-60 bg-gray-700 rounded animate-pulse" />
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

      {!isLoading && !isError && task && <TaskDetails task={task} />}
    </div>
  );
};

export default Task;
