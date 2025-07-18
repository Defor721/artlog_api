import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PerformancesModule } from './performances/performances.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { PostsModule } from './posts/posts.module';
import { LoggerModule } from './common/logger/logger.module';
import { S3Service } from './s3/s3.service';
import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from './comments/comments.module';
import { DiaryModule } from './diary/diary.module';
import { DiarysModule } from './diarys/diarys.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }), //전역에서 사용하도록, TTL 설정할 것. 추후 Redis 고려
    ConfigModule.forRoot({ isGlobal: true }), //s3service에서 주입받고 있으므로 appmodule에서 import 해야함
    PrismaModule,
    UsersModule,
    PerformancesModule,
    AuthModule,
    PostsModule,
    LoggerModule,
    CommentsModule,
    DiaryModule,
    DiarysModule,
    AdminModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: RolesGuard },
    S3Service,
  ],
})
export class AppModule {}
