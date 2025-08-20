import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';

@Module({
  // S3Service에서 ConfigService를 쓰니 ConfigModule이 필요합니다.
  // 전역이 아니라면 여기서 import 해야 함.
  imports: [ConfigModule], // AppModule에서 isGlobal: true면 생략 가능
  providers: [S3Service],
  exports: [S3Service], // ✅ 다른 모듈에서 사용할 수 있게 내보냄
})
export class S3Module {}
