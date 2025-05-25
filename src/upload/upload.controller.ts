import { Controller, Get, Query } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Get('presigned-url')
  @ApiOperation({ summary: '사진 업로드' })
  @ApiResponse({
    status: 200,
    description: '업로드 url, 접근용 publicurl 반환',
  })
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
