import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { MessageService } from "src/message/message.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private messageService: MessageService) {}

  handleConnection(client: any, ...args: any[]) {
    console.log("connect success");
    // throw new Error("Method not implemented.");
  }

  @SubscribeMessage("events")
  handleEvent(@MessageBody() body: any): number {
    console.log(body);
    return body;
  }
}
