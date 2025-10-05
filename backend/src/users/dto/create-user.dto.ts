import { IsEmail, IsString, IsOptional, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
