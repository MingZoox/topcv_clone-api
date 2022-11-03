import { S3 } from "aws-sdk";
import { Logger, Injectable } from "@nestjs/common";
import { User } from "src/common/entities/user.entity";

@Injectable()
export class S3UploadService {
  async upload(file: Express.Multer.File, upload: string, currentUser: User) {
    const bucketS3 = "topcv-clone";
    const fileName = `${currentUser.id}/${upload}`;
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

  removeS3(fileName: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: "topcv-clone",
      Key: fileName,
    };

    s3.deleteObject(params, (err) => {
      if (err) throw new Error(err.message);
    });
  }
}
