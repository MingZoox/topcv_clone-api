import { Type } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
} from "class-validator";
import { JobLocation } from "src/common/constants/job.enum";

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 50)
  password: string;

  @IsString()
  @IsNotEmpty()
  website: string;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  employeeNumber: number;

  @IsString()
  @IsNotEmpty()
  introduction: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsEnum(JobLocation)
  location: JobLocation;
}
