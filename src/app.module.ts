import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PerformancesModule } from './performances/performances.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, store: 'memory' }), //전역에서 사용하도록, TTL 설정할 것.
    PrismaModule,
    UsersModule,
    PerformancesModule,
    AuthModule,
    UploadModule,
    PostsModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
