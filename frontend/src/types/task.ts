import { User } from "@/types/user";

export enum Status {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

export type Task = {
  taskId: string;
  title: string;
  description: string;
  status: Status;
  dueDate: string;
  createdBy: User;
  assignedUser?: User;
  createdAt: string;
  updatedAt: string;
};
