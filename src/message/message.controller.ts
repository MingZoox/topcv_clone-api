import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Auth } from "src/common/decorators/role-auth.decorator";
import { User } from "src/common/entities/user.entity";
import { MessageService } from "./message.service";

@Controller("messages")
@UseInterceptors(ClassSerializerInterceptor)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get("users-sent")
  @Auth()
  getUsersSent(@CurrentUser() currentUser: User) {
    return this.messageService.getUsersSent(currentUser);
  }

  @Get(":toUserId")
  @Auth()
  get(@Param("toUserId") toUserId: number, @CurrentUser() currentUser: User) {
    return this.messageService.getInbox(toUserId, currentUser);
  }
}
