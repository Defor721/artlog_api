import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PerformancesModule } from './performances/performances.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, UsersModule, PerformancesModule, AuthModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
