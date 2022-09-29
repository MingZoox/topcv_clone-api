import { Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import {
  JobGender,
  JobLevel,
  JobSalary,
  JobWorkFormat,
} from "src/common/constants/job.enum";

export class UpdateJobDto {
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  expired: Date;

  @IsNotEmpty()
  @IsOptional()
  @IsEnum(JobSalary)
  salary: string;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  recruitQuantity: number;

  @IsNotEmpty()
  @IsOptional()
  @IsEnum(JobWorkFormat)
  workFormat: string;

  @IsNotEmpty()
  @IsOptional()
  @IsEnum(JobLevel)
  level: string;

  @IsNotEmpty()
  @IsOptional()
  @IsEnum(JobGender)
  gender: string;

  @IsNotEmpty()
  @IsOptional()
  experience: string;
}
