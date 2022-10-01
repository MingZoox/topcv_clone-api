import { Module } from "@nestjs/common";
import { S3UploadService } from "./s3upload.service";

@Module({
  providers: [S3UploadService],
  exports: [S3UploadService],
})
export class SharedModule {}
