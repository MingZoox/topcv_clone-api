import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 50)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(0, 50)
  username: string;
}
