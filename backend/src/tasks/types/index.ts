import { Task } from "src/tasks/schemas/task.schema";

type ExcludedProps = "_id" | "__v";

export type FormattedTask = Omit<Task, ExcludedProps> & {
  taskId: string;
};

export enum Status {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed"
}
