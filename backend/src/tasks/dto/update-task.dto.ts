import {
  IsEnum,
  IsString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsDateString
} from "class-validator";

// types.
import { Status } from "src/tasks/types";

export class UpdateTaskParamDto {
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  taskId: string;
}

export class UpdateTaskBodyDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsMongoId()
  @IsOptional()
  assignedUser?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  dueDate?: string;
}
