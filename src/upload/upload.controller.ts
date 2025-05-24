import { Controller, Get, Query } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Get('presigned-url')
  async getPresignedUrl(
    @Query('fileName') fileName: string,
    @Query('fileType') fileType: string,
  ) {
    const result = await this.s3Service.generatePresignedUploadUrl(
      fileName,
      fileType,
    );
    return result; // { uploadUrl, publicUrl }
  }
}
