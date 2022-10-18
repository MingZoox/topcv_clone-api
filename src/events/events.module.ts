import { Module } from "@nestjs/common";
import { MessageModule } from "src/message/message.module";
import { EventsGateway } from "./events.gateway";

@Module({
  imports: [MessageModule],
  providers: [EventsGateway],
})
export class EventsModule {}
