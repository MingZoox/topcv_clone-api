import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
  SerializeOptions,
  Put,
  Post,
} from "@nestjs/common";
import { UserRole } from "../common/constants/role.enum";
import { CreateUserDto } from "../common/dtos/user-dto/create-user.dto";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { User } from "../common/entities/user.entity";
import { Auth } from "../common/decorators/role-auth.decorator";
import { UpdateUserDto } from "../common/dtos/user-dto/update-user.dto";
import { UserService } from "./user.service";

@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SerializeOptions({ groups: [UserRole.ADMIN] })
  find() {
    return this.userService.find();
  }

  @Get("me")
  @Auth()
  getCurrentUser(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post("signup")
  signup(@Body() createUser: CreateUserDto) {
    return this.userService.signup(createUser);
  }

  @Put(":id")
  @Auth()
  update(
    @Body() updateUser: UpdateUserDto,
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.userService.update(id, updateUser, currentUser);
  }

  @Delete(":id")
  @Auth(UserRole.ADMIN)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
