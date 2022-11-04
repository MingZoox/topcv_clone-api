import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserRole } from "src/common/constants/role.enum";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Auth } from "src/common/decorators/role-auth.decorator";
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

  @Get("my-company")
  @Auth(UserRole.COMPANY)
  findByCompany(
    @CurrentUser() currentUser: User,
    @Query("limit", ParseIntPipe) limit?: number,
    @Query("page", ParseIntPipe) page?: number,
  ) {
    return this.jobService.findByCompany(page, limit, currentUser);
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

  @Post("upload-cv/:id")
  @Auth()
  @UseInterceptors(FileInterceptor("file"))
  async uploadCV(
    @Param("id", ParseIntPipe)
    id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: "pdf" }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() currentUser: User,
  ) {
    return this.jobService.uploadCV(id, currentUser, file);
  }
}
