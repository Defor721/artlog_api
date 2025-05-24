import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { S3Service } from 'src/s3/s3.service';

@Module({
  providers: [UploadService, S3Service],
  controllers: [UploadController],
})
export class UploadModule {}
