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
export class DeleteTaskGuard implements CanActivate {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const taskId = request.params.taskId;

    const task = await this.taskModel.findById(taskId).exec();

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    if (task.createdBy.toString() !== userId) {
      throw new ForbiddenException("You can only delete tasks you created");
    }

    return true;
  }
}
