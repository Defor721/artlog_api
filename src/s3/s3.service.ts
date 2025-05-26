import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { Express } from 'express';
type UploadResult = { key: string; url: string };
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

  async uploadFiles(
    userId: string,
    postId: string,
    files: Express.Multer.File[],
  ): Promise<UploadResult[]> {
    const uploadResults: UploadResult[] = [];

    for (const file of files) {
      const key = `uploads/${userId}/${postId}/${uuid()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await this.s3.send(command);

      const url = `https://${this.bucket}.s3.${this.config.get<string>(
        'AWS_REGION',
      )}.amazonaws.com/${key}`;

      uploadResults.push({ key, url });
    }

    return uploadResults;
  }
  async deleteFiles(keys: string[]) {
    if (keys.length === 0) return;

    const deleteParams = {
      Bucket: this.bucket,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    };

    await this.s3.send(new DeleteObjectsCommand(deleteParams));
  }
}
