import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { UserRole } from "src/common/constants/role.enum";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Auth } from "src/common/decorators/role-auth.decorator";
import { User } from "src/common/entities/user.entity";
import { CVService } from "./cv.service";

@Controller("cv")
export class CvController {
  constructor(private readonly cvService: CVService) {}

  @Get()
  @Auth(UserRole.COMPANY, UserRole.ADMIN)
  find(
    @Query("limit", ParseIntPipe) limit?: number,
    @Query("page", ParseIntPipe) page?: number,
  ) {
    return this.cvService.find(page, limit);
  }

  @Get("my-company")
  @Auth(UserRole.COMPANY)
  findByCompany(
    @CurrentUser() currentUser: User,
    @Query("limit", ParseIntPipe) limit?: number,
    @Query("page", ParseIntPipe) page?: number,
  ) {
    return this.cvService.findByCompany(page, limit, currentUser);
  }

  @Delete(":id")
  @Auth(UserRole.COMPANY, UserRole.ADMIN)
  remove(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.cvService.remove(id, currentUser);
  }
}
