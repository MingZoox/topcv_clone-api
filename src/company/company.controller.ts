import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { UserRole } from "src/common/constants/role.enum";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Auth } from "src/common/decorators/role-auth.decorator";
import { CreateCompanyDto } from "src/common/dtos/company-dto/create-company.dto";
import { UpdateCompanyDto } from "src/common/dtos/company-dto/update-company.dto";
import { User } from "src/common/entities/user.entity";
import { CompanyService } from "./company.service";

@Controller("companies")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Auth(UserRole.ADMIN)
  create(@Body() createCompany: CreateCompanyDto) {
    return this.companyService.create(createCompany);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.companyService.findOne(id);
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
