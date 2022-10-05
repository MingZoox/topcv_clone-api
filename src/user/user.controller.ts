import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
  Put,
  Post,
  UploadedFile,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from "@nestjs/common";
import { S3UploadService } from "src/shared/s3upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
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

  @Post("upload-avatar")
  @Auth()
  @UseInterceptors(FileInterceptor("file"))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 150000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() currentUser: User,
  ) {
    return this.userService.uploadAvatar(currentUser, file);
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
