import { format } from "date-fns";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// contexts.
import { useAuth } from "@/contexts/AuthContext";

// types.
import { Task } from "@/types/task";

// react-query hook
import { Status } from "@/types/task";
import { useDeleteTask } from "@/api/tasks";

type TaskDetailsProps = {
  task: Task;
};

const TaskDetails = ({ task }: TaskDetailsProps) => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { mutateAsync: deleteTask } = useDeleteTask();

  const handleEdit = () => navigate(`/tasks/${task.taskId}/edit`);

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirm) {
      deleteTask(task.taskId, {
        onSuccess: () => {
          toast.success("Task deleted successfully");
          navigate(-1);
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

  const canEdit = () => {
    if (!user) return false;
    return (
      task.createdBy.userId === user.userId ||
      task.assignedUser?.userId === user.userId
    );
  };

  const canDelete = () => {
    if (!user) return false;
    return task.createdBy.userId === user.userId;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="overflow-hidden rounded border border-gray-700 bg-gray-900 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Title
              </label>
              <div className="text-white text-lg">{task.title}</div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                title="Edit Task"
                onClick={handleEdit}
                disabled={!canEdit()}
                className={`p-2 rounded-full border border-gray-600 transition-all cursor-pointer disabled:cursor-not-allowed ${
                  canEdit()
                    ? "hover:border-emerald-400 hover:bg-emerald-400/10 text-emerald-400 hover:text-emerald-300"
                    : "opacity-50 text-gray-500"
                }`}
              >
                <Pencil size={16} />
              </button>
              <button
                title="Delete Task"
                onClick={handleDelete}
                disabled={!canDelete()}
                className={`p-2 rounded-full border border-gray-600 transition-all cursor-pointer disabled:cursor-not-allowed ${
                  canDelete()
                    ? "hover:border-red-400 hover:bg-red-400/10 text-red-400 hover:text-red-300"
                    : "opacity-50 text-gray-500"
                }`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <div className="text-white">{task.description}</div>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-10 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === Status.COMPLETED
                    ? "bg-green-900 text-green-300"
                    : task.status === Status.IN_PROGRESS
                    ? "bg-blue-900 text-blue-300"
                    : "bg-yellow-900 text-yellow-300"
                }`}
              >
                {task.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400">Due Date:</span>
              <span className="text-white">
                {format(new Date(task.dueDate), "dd MMMM, yyyy")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400">Assigned To:</span>
              <span className="text-white">
                {task.assignedUser?.fullName || "N/A"}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-10 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Created:</span>
              <span className="text-white">
                {format(new Date(task.createdAt), "dd MMMM yyyy, h:mm a")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400">Updated:</span>
              <span className="text-white">
                {format(new Date(task.updatedAt), "dd MMMM yyyy, h:mm a")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400">Created by:</span>
              <span className="text-white">{task.createdBy.fullName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
