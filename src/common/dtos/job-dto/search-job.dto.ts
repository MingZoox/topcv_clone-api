import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import {
  JobLevel,
  JobLocation,
  JobSalary,
  JobWorkFormat,
} from "src/common/constants/job.enum";

export class SearchJobDto {
  @IsInt()
  @Type(() => Number)
  page = 1;

  @IsNotEmpty()
  search: string;

  @IsInt()
  @Type(() => Number)
  limit = 10;

  @IsOptional()
  @IsEnum(JobSalary)
  salary: JobSalary;

  @IsOptional()
  @IsEnum(JobWorkFormat)
  workFormat: JobWorkFormat;

  @IsOptional()
  @IsEnum(JobLevel)
  level: JobLevel;

  @IsOptional()
  @IsEnum(JobLocation)
  location: JobLocation;
}
