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
  UseGuards,
} from "@nestjs/common";
import { UserRole } from "src/common/constants/role.enum";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Auth } from "src/common/decorators/role-auth.decorator";
import { CreateCompanyDto } from "src/common/dtos/company-dto/create-company.dto";
import { UpdateCompanyDto } from "src/common/dtos/company-dto/update-company.dto";
import { CreateJobDto } from "src/common/dtos/job-dto/create-job.dto";
import { User } from "src/common/entities/user.entity";
import { OptionalAuthGuard } from "src/common/guards/optional-auth.guard";
import { CompanyService } from "./company.service";

@Controller("companies")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Auth(UserRole.ADMIN)
  create(@Body() createCompany: CreateCompanyDto) {
    return this.companyService.create(createCompany);
  }

  @Post("jobs")
  @Auth(UserRole.COMPANY)
  createJob(@Body() createJob: CreateJobDto, @CurrentUser() currentUser: User) {
    return this.companyService.createJob(createJob, currentUser);
  }

  @Get(":id")
  @UseGuards(OptionalAuthGuard)
  findOne(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: User | null,
  ) {
    return this.companyService.findOne(id, currentUser);
  }

  @Get()
  find(
    @Query("limit", ParseIntPipe) limit?: number,
    @Query("page", ParseIntPipe) page?: number,
  ) {
    return this.companyService.find(page, limit);
  }

  @Put("follow/:id")
  @Auth()
  followCompany(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.companyService.followCompany(id, currentUser);
  }

  @Put("unfollow/:id")
  @Auth()
  unFollowCompany(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.companyService.unFollowCompany(id, currentUser);
  }

  @Put(":id")
  @Auth(UserRole.ADMIN, UserRole.COMPANY)
  update(
    @Body() updateCompany: UpdateCompanyDto,
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.companyService.update(id, updateCompany, currentUser);
  }

  @Delete(":id")
  @Auth(UserRole.ADMIN)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.companyService.remove(id);
  }
}
