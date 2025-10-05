import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// contexts.
import { useAuth } from "@/contexts/AuthContext";

// types.
import { User } from "@/types/user";
import { Status } from "@/types/task";
import { useEffect } from "react";

// validation schema.
const taskSchema = z.object({
  title: z
    .string()
    .nonempty("Title is required")
    .min(5, "Title must be at least 5 characters long"),
  description: z
    .string()
    .nonempty("Description is required")
    .min(5, "Description must be at least 5 characters long"),
  status: z.enum(Status),
  dueDate: z.date("Due Date is required"),
  assignedUser: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
});

export type TaskFormInputs = z.infer<typeof taskSchema>;

type TaskFormProps = {
  users?: User[];
  createdBy?: User;
  values?: Partial<TaskFormInputs>;
  onSubmit: (data: TaskFormInputs) => void;
};

const defaultValues: TaskFormInputs = {
  title: "",
  description: "",
  status: Status.PENDING,
  dueDate: new Date(),
  assignedUser: "",
};

const statuses = Object.values(Status);

const TaskForm = ({ users, values, onSubmit, createdBy }: TaskFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TaskFormInputs>({
    defaultValues: { ...defaultValues, ...values },
    resolver: zodResolver(taskSchema),
  });

  const isCreator = createdBy?.userId === user?.userId;
  const isEditor = values?.assignedUser === user?.userId;

  useEffect(() => {
    if (values) {
      if (!isCreator && !isEditor) navigate("/");
    }
  }, [values]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block mb-1 text-sm">
          Title
        </label>
        <input
          id="title"
          disabled={isSubmitting}
          className="w-full px-4 py-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block mb-1 text-sm">
          Description
        </label>
        <textarea
          rows={4}
          id="description"
          disabled={isSubmitting}
          className="w-full px-4 py-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-400 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="status" className="block mb-1 text-sm">
            Status
          </label>
          <select
            id="status"
            disabled={isSubmitting}
            className="w-full h-10 px-4 py-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register("status")}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block mb-1 text-sm">
            Due Date
          </label>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <input
                type="date"
                id="dueDate"
                disabled={isSubmitting}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => field.onChange(new Date(e.target.value))}
                value={
                  field.value ? field.value.toISOString().split("T")[0] : ""
                }
                className="w-full h-10 px-4 py-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          />
          {errors.dueDate && (
            <p className="text-sm text-red-400 mt-1">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="assignedUser" className="block mb-1 text-sm">
            Assign To
          </label>
          <select
            id="assignedUser"
            disabled={isSubmitting || (values && !isCreator)}
            className="w-full h-10 px-4 py-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
            {...register("assignedUser")}
          >
            <option value="">-- Select User --</option>
            {users?.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.fullName}
              </option>
            ))}
          </select>
          {errors.assignedUser && (
            <p className="text-sm text-red-400 mt-1">
              {errors.assignedUser.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 font-medium text-white transition-colors bg-indigo-600 rounded cursor-pointer hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <svg
            fill="none"
            viewBox="0 0 24 24"
            className="w-5 h-5 text-white animate-spin"
          >
            <circle
              r="10"
              cx="12"
              cy="12"
              strokeWidth="4"
              className="opacity-25"
              stroke="currentColor"
            />
            <path
              fill="currentColor"
              className="opacity-75"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : values ? (
          "Update Task"
        ) : (
          "Create Task"
        )}
      </button>
    </form>
  );
};

export default TaskForm;
