import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ForgotPasswordDto } from "src/common/dtos/user-dto/forgot-password.dto";
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

  @Get("forgot")
  verifySendForgotEmail(@Query("token") token: string) {
    return this.authService.verifyMailForgetPassword(token);
  }

  @Post("forgot")
  sendForgotEmail(@Body() body: ForgotPasswordDto) {
    return this.authService.sendMailForgetPassword(body.email);
  }
}
