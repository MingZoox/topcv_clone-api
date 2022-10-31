import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { CreateMessageDto } from "src/common/dtos/message-dto/create-message.dto";
import { MessageService } from "src/message/message.service";
import { UserService } from "src/user/user.service";
import { UsePipes, ValidationPipe } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: "http://topcv-clone.netlify.com",
    methods: ["GET", "POST"],
  },
})
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private messageService: MessageService,
    private userService: UserService,
  ) {}

  handleConnection(socket) {
    try {
      const auth_token = socket.handshake.headers.authorization.split(" ")[1];
      const { userId } = this.jwtService.verify(auth_token);

      this.userService.findOne(userId).then((currentUser) => {
        socket.currentUser = currentUser;
      });
    } catch (err) {
      socket.disconnect();
    }
  }

  @SubscribeMessage("join_room")
  handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() socket) {
    socket.join(room);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("send_message")
  handleSendMessage(
    @MessageBody() body: CreateMessageDto,
    @ConnectedSocket() socket,
  ) {
    try {
      this.messageService.create(body, socket.currentUser);
      socket.to(body.room).emit("receive_message", body.content);
    } catch (err) {}
  }
}
