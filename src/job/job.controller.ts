import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { UserRole } from "src/common/constants/role.enum";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Auth } from "src/common/decorators/role-auth.decorator";
import { CreateJobDto } from "src/common/dtos/job-dto/create-job.dto";
import { SearchJobDto } from "src/common/dtos/job-dto/search-job.dto";
import { UpdateJobDto } from "src/common/dtos/job-dto/update-job.dto";
import { User } from "src/common/entities/user.entity";
import { JobService } from "./job.service";

@Controller("jobs")
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  findByFilter(@Query() searchJobDto: SearchJobDto) {
    return this.jobService.findByFilter(searchJobDto);
  }

  @Post()
  @Auth(UserRole.COMPANY)
  create(@Body() createJob: CreateJobDto, @CurrentUser() currentUser: User) {
    return this.jobService.create(createJob, currentUser);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.jobService.findOne(id);
  }

  @Put(":id")
  @Auth(UserRole.ADMIN, UserRole.COMPANY)
  update(
    @Body() updateJob: UpdateJobDto,
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.jobService.update(id, updateJob, currentUser);
  }

  @Delete(":id")
  @Auth(UserRole.ADMIN, UserRole.COMPANY)
  remove(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.jobService.remove(id, currentUser);
  }
}
