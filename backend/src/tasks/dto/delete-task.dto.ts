import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class DeleteTaskParamDto {
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  taskId: string;
}
