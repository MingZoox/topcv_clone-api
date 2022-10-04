import { Body, Controller, Post } from "@nestjs/common";
import { LoginUserOAuthDto } from "src/common/dtos/user-dto/login-user-oauth.dto";
import { LoginUserDto } from "../common/dtos/user-dto/login-user.dto";
import { AuthService } from "./auth.service";

@Controller("users")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() loginUser: LoginUserDto) {
    return this.authService.login(loginUser);
  }

  @Post("login-oauth")
  loginOAuth(@Body() loginOAuthUser: LoginUserOAuthDto) {
    return this.authService.loginOAuth(loginOAuthUser);
  }
}
