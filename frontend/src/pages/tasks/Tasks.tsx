import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

// react-query hooks.
import { useTasks, useDeleteTask } from "@/api/tasks";

// types.
import { Status } from "@/types/task";

// react components.
import TaskList from "@/components/tasks/TaskList";
import SearchFilter from "@/components/tasks/SearchFilter";

const Tasks = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });
  const [statusFilter, setStatusFilter] = useQueryState("status", {
    defaultValue: "All" as Status,
  });

  const { mutateAsync: deleteTask } = useDeleteTask();
  const {
    isError,
    isLoading,
    data: tasks = [],
  } = useTasks({
    search: searchQuery,
    status: statusFilter as Status,
  });

  const handleView = (taskId: string) => navigate(`/tasks/${taskId}`);
  const handleEdit = (taskId: string) => navigate(`/tasks/${taskId}/edit`);

  const handleDelete = async (taskId: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirm) {
      deleteTask(taskId, {
        onSuccess: () => {
          toast.success("Task deleted successfully");
        },
        onError: (err) => {
          let message = "Task delete failed";

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
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">All Tasks</h1>
        <button
          onClick={() => navigate("/tasks/create")}
          className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Task</span>
        </button>
      </div>

      <SearchFilter
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
      />

      {isLoading && (
        <div className="w-full mt-6 overflow-x-auto">
          <div className="overflow-hidden rounded border border-gray-700">
            <div className="bg-gray-900 text-gray-200">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`px-4 py-3 border-t border-gray-700 ${
                    index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-4 bg-gray-700 rounded animate-pulse flex-1"></div>
                    <div className="h-6 w-16 bg-gray-700 rounded-full animate-pulse hidden sm:block"></div>
                    <div className="h-4 w-20 bg-gray-700 rounded animate-pulse hidden md:block"></div>
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse hidden lg:block"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isLoading && isError && (
        <div className="w-full mt-6 overflow-x-auto">
          <div className="overflow-hidden rounded border border-gray-700 bg-gray-900 text-gray-200">
            <div className="px-4 py-12 text-center text-red-400">
              Failed to load tasks.
            </div>
          </div>
        </div>
      )}

      {!isLoading && !isError && tasks.length === 0 && (
        <div className="w-full mt-6 overflow-x-auto">
          <div className="overflow-hidden rounded border border-gray-700 bg-gray-900 text-gray-200">
            <div className="px-4 py-12 text-center text-gray-400">
              No tasks available.
            </div>
          </div>
        </div>
      )}

      {!isLoading && !isError && tasks.length > 0 && (
        <TaskList
          tasks={tasks}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};

export default Tasks;
