import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }) {
    const userId = await this.userService.login({ email, password });
    const payload = { userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginOAuth({ email, username, avatar }) {
    const userId = await this.userService.loginOAuth({
      email,
      username,
      avatar,
    });
    const payload = { userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
