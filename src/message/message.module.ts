import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "src/common/entities/message.entity";
import { UserModule } from "src/user/user.module";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UserModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
