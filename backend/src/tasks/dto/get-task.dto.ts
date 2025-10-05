import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class GetTaskParamDto {
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  taskId: string;
}
