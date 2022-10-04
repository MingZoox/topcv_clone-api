import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CV } from "src/common/entities/cv.entity";
import { CVService } from "./cv.service";

@Module({
  imports: [TypeOrmModule.forFeature([CV])],
  providers: [CVService],
  exports: [CVService],
})
export class CVModule {}
