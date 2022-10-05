import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Company } from "src/common/entities/company.entity";
import { JobModule } from "src/job/job.module";
import { NotificationModule } from "src/notification/notification.module";
import { UserModule } from "src/user/user.module";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";

@Module({
  imports: [
    UserModule,
    JobModule,
    NotificationModule,
    TypeOrmModule.forFeature([Company]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
