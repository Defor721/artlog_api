import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;

  constructor(private config: ConfigService) {
    this.s3 = new S3Client({
      region: config.get<string>('AWS_REGION')!,
      credentials: {
        accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY')!,
      },
    });
    this.bucket = config.get<string>('AWS_S3_BUCKET')!;
  }

  async generatePresignedUploadUrl(fileName: string, fileType: string) {
    const key = `uploads/${uuid()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: fileType,
      ACL: 'public-read', // ✅ 공개용
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 600 }); // 10분 유효
    const publicUrl = `https://${this.bucket}.s3.${this.config.get<string>(
      'AWS_REGION',
    )}.amazonaws.com/${key}`;

    return { uploadUrl: url, publicUrl };
  }
}
