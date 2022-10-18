import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MessageModule } from "src/message/message.module";
import { UserModule } from "src/user/user.module";
import { EventsGateway } from "./events.gateway";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
      }),
    }),
    MessageModule,
    UserModule,
  ],
  providers: [EventsGateway],
})
export class EventsModule {}
