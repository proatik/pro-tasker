import {
  IsEnum,
  IsString,
  IsMongoId,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsDateString
} from "class-validator";

// types.
import { Status } from "src/tasks/types";

export class CreateTaskBodyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  description: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsMongoId()
  @IsOptional()
  @IsNotEmpty()
  assignedUser?: string;

  @IsNotEmpty()
  @IsDateString()
  dueDate: string;
}
