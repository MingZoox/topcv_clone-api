import { Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";
import {
  JobGender,
  JobLevel,
  JobSalary,
  JobWorkFormat,
} from "src/common/constants/job.enum";

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  expired: Date;

  @IsNotEmpty()
  @IsString()
  @IsEnum(JobSalary)
  salary: string;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  recruitQuantity: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(JobWorkFormat)
  workFormat: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(JobLevel)
  level: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(JobGender)
  gender: string;

  @IsNotEmpty()
  @IsString()
  experience: string;
}
