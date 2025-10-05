import { omit } from "lodash";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";

// types.
import { FormattedTask } from "src/tasks/types";

// schemas.
import { Task } from "src/tasks/schemas/task.schema";

// dto.
import { GetTasksParamDto } from "src/tasks/dto/get-tasks.tdo";
import { CreateTaskBodyDto } from "src/tasks/dto/create-task.dto";
import { UpdateTaskBodyDto } from "src/tasks/dto/update-task.dto";

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async createTask(
    userId: string,
    createTaskDto: CreateTaskBodyDto
  ): Promise<{ task: FormattedTask; message: string }> {
    const task = new this.taskModel({
      ...createTaskDto,
      createdBy: userId
    });

    const createdTask = await task.save();

    const populatedTask = await this.taskModel
      .findById(createdTask._id)
      .populate("assignedUser", "fullName email")
      .populate("createdBy", "fullName email")
      .exec();

    const formattedTask = this.formatTask(populatedTask);

    return { task: formattedTask, message: "Task created successfully" };
  }

  async getTasks({
    search,
    status,
    dueDate
  }: GetTasksParamDto): Promise<FormattedTask[]> {
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (dueDate) {
      const startDate = new Date(dueDate);
      const endDate = new Date(dueDate);

      endDate.setHours(23, 59, 59, 999);
      query.dueDate = { $gte: startDate, $lte: endDate };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const tasks = await this.taskModel
      .find(query)
      .populate("assignedUser", "fullName email")
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 })
      .exec();

    return tasks.map((task) => this.formatTask(task));
  }

  async getTask(taskId: string): Promise<FormattedTask | { message: string }> {
    const task = await this.taskModel
      .findById(taskId)
      .populate("assignedUser", "fullName email")
      .populate("createdBy", "fullName email")
      .exec();

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return this.formatTask(task);
  }

  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskBodyDto
  ): Promise<{ task: FormattedTask; message: string }> {
    const task = await this.taskModel
      .findByIdAndUpdate(taskId, updateTaskDto, { new: true })
      .populate("assignedUser", "fullName email")
      .populate("createdBy", "fullName email")
      .exec();

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    const formattedTask = this.formatTask(task);
    return { task: formattedTask, message: "Task updated successfully" };
  }

  async deleteTask(taskId: string): Promise<{ message: string }> {
    const result = await this.taskModel.deleteOne({ _id: taskId }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException("Task not found");
    }

    return { message: "Task deleted successfully" };
  }

  private formatTask(task: Task, props: string[] = []): FormattedTask {
    const taskData = task.toObject();

    if (
      taskData.createdBy &&
      typeof taskData.createdBy === "object" &&
      taskData.createdBy._id
    ) {
      taskData["createdBy"]["userId"] = taskData.createdBy._id.toString();
    }

    if (
      taskData.assignedUser &&
      typeof taskData.assignedUser === "object" &&
      taskData.assignedUser._id
    ) {
      taskData["assignedUser"]["userId"] = taskData.assignedUser._id.toString();
    }

    return {
      ...omit(taskData, [
        "_id",
        "__v",
        "createdBy._id",
        "assignedUser._id",
        ...props
      ]),
      taskId: taskData._id.toString()
    };
  }
}
