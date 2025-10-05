import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException
} from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

// schemas.
import { Task } from "src/tasks/schemas/task.schema";

@Injectable()
export class UpdateTaskGuard implements CanActivate {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const taskId = request.params.taskId;

    const task = await this.taskModel.findById(taskId).exec();

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    const isCreator = task.createdBy?.toString() === userId;
    const isAssigned = task.assignedUser?.toString() === userId;

    if (!isCreator && !isAssigned) {
      throw new ForbiddenException(
        "You can only update tasks you created or are assigned to"
      );
    }

    return true;
  }
}
