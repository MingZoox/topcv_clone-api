import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from "@nestjs/common";
import { UploadFileType } from "../constants/upload-type";

export const FileType = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const typeFile: UploadFileType = request.query[key];

    if (!typeFile) {
      throw new BadRequestException(`Missing required query param: '${key}'`);
    }
    if (!Object.values(UploadFileType).includes(typeFile)) {
      throw new BadRequestException("Type does not match the enum !");
    }

    return typeFile;
  },
);
