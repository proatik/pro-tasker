import { IsEnum, IsString, IsOptional, IsDateString } from "class-validator";

// types.
import { Status } from "src/tasks/types";

export class GetTasksParamDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
