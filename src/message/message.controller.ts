import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Auth } from "src/common/decorators/role-auth.decorator";
import { CreateMessageDto } from "src/common/dtos/message-dto/create-message.dto";
import { User } from "src/common/entities/user.entity";
import { MessageService } from "./message.service";

@Controller("messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @Auth()
  create(
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.messageService.create(createMessageDto, currentUser);
  }

  @Get(":id")
  @Auth()
  get(@Param("id") id: number, @CurrentUser() currentUser: User) {
    return this.messageService.getInbox(id, currentUser);
  }
}
