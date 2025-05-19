import { Module } from '@nestjs/common';
import { PerformancesService } from './performances.service';
import { PerformancesController } from './performances.controller';

@Module({
  providers: [PerformancesService],
  controllers: [PerformancesController]
})
export class PerformancesModule {}
