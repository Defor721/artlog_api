import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PerformancesModule } from './performances/performances.module';

@Module({
  imports: [PrismaModule, UsersModule, PerformancesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
