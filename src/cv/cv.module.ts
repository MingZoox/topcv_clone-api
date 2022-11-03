import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CV } from "src/common/entities/cv.entity";
import { SharedModule } from "src/shared/shared.module";
import { CVService } from "./cv.service";
import { CvController } from "./cv.controller";

@Module({
  imports: [TypeOrmModule.forFeature([CV]), SharedModule],
  providers: [CVService],
  exports: [CVService],
  controllers: [CvController],
})
export class CVModule {}
