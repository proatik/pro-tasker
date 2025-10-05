import { format } from "date-fns";
import { Pencil, Trash2, Eye } from "lucide-react";

// contexts.
import { useAuth } from "@/contexts/AuthContext";

// types.
import { Task, Status } from "@/types/task";

type TaskListProps = {
  tasks: Task[];
  searchQuery: string;
  onView: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
};

const TaskList = ({ tasks, onView, onEdit, onDelete }: TaskListProps) => {
  const { user } = useAuth();

  const canEdit = (task: Task) => {
    if (!user) return false;
    return (
      task.createdBy.userId === user.userId ||
      task.assignedUser?.userId === user.userId
    );
  };

  const canDelete = (task: Task) => {
    if (!user) return false;
    return task.createdBy.userId === user.userId;
  };

  return (
    <div className="overflow-hidden rounded border border-gray-700">
      <table className="min-w-full table-auto text-sm md:text-base">
        <thead className="bg-gray-800 text-whit">
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left hidden sm:table-cell">Status</th>
            <th className="px-4 py-2 text-left hidden md:table-cell">
              Due Date
            </th>
            <th className="px-4 py-2 text-left hidden lg:table-cell">
              Assigned To
            </th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 text-gray-200">
          {tasks.map((task, index) => (
            <tr
              key={task.taskId}
              className={`border-t border-gray-700 ${
                index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
              }`}
            >
              <td className="px-4 py-3">{task.title}</td>
              <td className="px-4 py-3 hidden sm:table-cell">
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
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                {format(new Date(task.dueDate), "dd MMM yyyy")}
              </td>
              <td className="px-4 py-3 hidden lg:table-cell">
                {task.assignedUser?.fullName || "Unassigned"}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <button
                    title="View Details"
                    onClick={() => onView(task.taskId)}
                    className="p-2 rounded-full border border-gray-600 hover:border-sky-400 hover:bg-sky-400/10 text-sky-400 hover:text-sky-300 transition-all cursor-pointer"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    title="Edit Task"
                    disabled={!canEdit(task)}
                    onClick={() => onEdit(task.taskId)}
                    className={`p-2 rounded-full border border-gray-600 transition-all cursor-pointer disabled:cursor-not-allowed ${
                      canEdit(task)
                        ? "hover:border-emerald-400 hover:bg-emerald-400/10 text-emerald-400 hover:text-emerald-300"
                        : "opacity-50 text-gray-500"
                    }`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    title="Delete Task"
                    disabled={!canDelete(task)}
                    onClick={() => onDelete(task.taskId)}
                    className={`p-2 rounded-full border border-gray-600 transition-all cursor-pointer disabled:cursor-not-allowed ${
                      canDelete(task)
                        ? "hover:border-red-400 hover:bg-red-400/10 text-red-400 hover:text-red-300"
                        : "opacity-50 text-gray-500"
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
