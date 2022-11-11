import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailerService,
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

  async sendMailForgetPassword(email: string) {
    const token: string = this.jwtService.sign({ email });
    const verifyLink = `${process.env.SERVER_URL}/users/forgot?token=${token}`;
    const contentHtml = `Click on the following link to verify the request. Your password is automatically set to 00000000
                        ${verifyLink}
                        The link is valid for one hour`;

    const response = await this.mailService.sendMail({
      to: email,
      from: process.env.SMTP_MAIL,
      subject: "Account Recovery",
      text: contentHtml,
    });
    return response;
  }

  async verifyMailForgetPassword(token: string): Promise<string> {
    const { email } = this.jwtService.verify(token);
    if (!email) throw new BadRequestException("token invalid!");

    return await this.userService.verifyMailForgetPassword(email);
  }
}
