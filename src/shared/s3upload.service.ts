import { S3 } from "aws-sdk";
import { Logger, Injectable } from "@nestjs/common";
import { UploadFileType } from "src/common/constants/upload-type";
import { User } from "src/common/entities/user.entity";

@Injectable()
export class S3UploadService {
  async upload(
    file: Express.Multer.File,
    typeFile: UploadFileType,
    currentUser: User,
  ) {
    const bucketS3 = "topcv-clone";
    const fileName = `${currentUser.id}/${typeFile}`;
    await this.uploadS3(file.buffer, bucketS3, fileName);
  }

  async uploadS3(file, bucket: string, name: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: name,
      Body: file,
    };
    try {
      await s3.upload(params).promise();
    } catch (err) {
      Logger.error(err);
    }
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
