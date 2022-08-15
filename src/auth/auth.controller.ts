import { Body, Controller, Post } from "@nestjs/common";
import { LoginUserDto } from "../common/dto/user-dto/login-user.dto";
import { AuthService } from "./auth.service";

@Controller("users")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() loginUser: LoginUserDto) {
    return this.authService.login(loginUser);
  }
}
