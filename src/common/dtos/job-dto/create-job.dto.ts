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
  @IsEnum(JobSalary)
  salary: JobSalary;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  recruitQuantity: number;

  @IsNotEmpty()
  @IsEnum(JobWorkFormat)
  workFormat: JobWorkFormat;

  @IsNotEmpty()
  @IsEnum(JobLevel)
  level: JobLevel;

  @IsNotEmpty()
  @IsEnum(JobGender)
  gender: JobGender;

  @IsNotEmpty()
  @IsString()
  experience: string;
}
