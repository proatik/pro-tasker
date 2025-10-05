import {
  Req,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  Delete,
  UseGuards,
  Controller
} from "@nestjs/common";
import { Request } from "express";

// dto.
import { GetTaskParamDto } from "src/tasks/dto/get-task.dto";
import { GetTasksParamDto } from "src/tasks/dto/get-tasks.tdo";
import { CreateTaskBodyDto } from "src/tasks/dto/create-task.dto";
import { UpdateTaskBodyDto } from "src/tasks/dto/update-task.dto";
import { UpdateTaskParamDto } from "src/tasks/dto/update-task.dto";
import { DeleteTaskParamDto } from "src/tasks/dto/delete-task.dto";

// guards.
import { AuthGuard } from "src/auth/guards/auth.guard";
import { UpdateTaskGuard } from "src/tasks/guards/update-task.guard";
import { DeleteTaskGuard } from "src/tasks/guards/delete-task.guard";

// services.
import { TaskService } from "src/tasks/tasks.service";

@Controller("tasks")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(AuthGuard)
  createTask(
    @Body() createTaskDto: CreateTaskBodyDto,
    @Req() { userId }: Request & { userId: string }
  ) {
    return this.taskService.createTask(userId, createTaskDto);
  }

  @Get()
  getTasks(@Query() getTasksDto: GetTasksParamDto) {
    return this.taskService.getTasks(getTasksDto);
  }

  @Get(":taskId")
  getTask(@Param() { taskId }: GetTaskParamDto) {
    return this.taskService.getTask(taskId);
  }

  @Patch(":taskId")
  @UseGuards(AuthGuard, UpdateTaskGuard)
  updateTask(
    @Body() updateTaskDto: UpdateTaskBodyDto,
    @Param() { taskId }: UpdateTaskParamDto
  ) {
    return this.taskService.updateTask(taskId, updateTaskDto);
  }

  @Delete(":taskId")
  @UseGuards(AuthGuard, DeleteTaskGuard)
  deleteTask(@Param() { taskId }: DeleteTaskParamDto) {
    return this.taskService.deleteTask(taskId);
  }
}
