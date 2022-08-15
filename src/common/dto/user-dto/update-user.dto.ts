import { IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(8, 50)
  password: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  username: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
