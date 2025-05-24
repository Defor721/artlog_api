import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;

  constructor(private config: ConfigService) {
    this.s3 = new S3Client({
      region: this.config.get<string>('AWS_REGION')!,
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY')!,
      },
    });
    this.bucket = this.config.get<string>('AWS_S3_BUCKET')!;
  }

  async uploadFile(file: Express.Multer.File) {
    const key = `uploads/${uuid()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    await this.s3.send(command);

    return {
      key,
      url: `https://${this.bucket}.s3.${this.config.get<string>('AWS_REGION')}.amazonaws.com/${key}`,
    };
  }
}
