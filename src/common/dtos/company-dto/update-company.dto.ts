import { Type } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { JobLocation } from "src/common/constants/job.enum";

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(8, 50)
  password: string;

  @IsOptional()
  @IsString()
  website: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  employeeNumber: number;

  @IsOptional()
  @IsString()
  introduction: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsEnum(JobLocation)
  location: JobLocation;
}
