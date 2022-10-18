import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./common/entities/user.entity";
import { AuthModule } from "./auth/auth.module";
import { CompanyModule } from "./company/company.module";
import { Company } from "./common/entities/company.entity";
import { Job } from "./common/entities/job.entity";
import { Notification } from "./common/entities/notification.entity";
import { NotificationModule } from "./notification/notification.module";
import { CV } from "./common/entities/cv.entity";
import { Message } from "./common/entities/message.entity";
import { EventsModule } from "./events/events.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Company, Job, Notification, CV, Message],
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        service: "gmail",
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASS,
        },
      },
    }),
    AuthModule,
    CompanyModule,
    NotificationModule,
    EventsModule,
  ],
})
export class AppModule {}
