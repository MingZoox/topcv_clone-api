import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Job } from "src/common/entities/job.entity";
import { CVModule } from "src/cv/cv.module";
import { SharedModule } from "src/shared/shared.module";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";

@Module({
  imports: [TypeOrmModule.forFeature([Job]), CVModule, SharedModule],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
