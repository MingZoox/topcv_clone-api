import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Auth } from "src/common/decorators/role-auth.decorator";
import { CreateMessageDto } from "src/common/dtos/message-dto/create-message.dto";
import { User } from "src/common/entities/user.entity";
import { MessageService } from "./message.service";

@Controller("messages")
@UseInterceptors(ClassSerializerInterceptor)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(":toUserId")
  @Auth()
  get(@Param("toUserId") toUserId: number, @CurrentUser() currentUser: User) {
    return this.messageService.getInbox(toUserId, currentUser);
  }
}
