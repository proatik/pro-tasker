import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

// schemas.
import { Task, TaskSchema } from "src/tasks/schemas/task.schema";

// controllers.
import { TaskController } from "src/tasks/tasks.controller";

// services.
import { TaskService } from "src/tasks/tasks.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService]
})
export class TasksModule {}
