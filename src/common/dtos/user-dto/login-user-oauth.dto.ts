import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserOAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  avatar: string;
}
