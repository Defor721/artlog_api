import { Module } from '@nestjs/common';
import { DiarysService } from './diarys.service';
import { DiarysController } from './diarys.controller';

@Module({
  controllers: [DiarysController],
  providers: [DiarysService],
})
export class DiarysModule {}
