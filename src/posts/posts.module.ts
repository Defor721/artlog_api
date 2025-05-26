import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [PrismaModule],
  providers: [PostsService, S3Service],
  controllers: [PostsController],
})
export class PostsModule {}
