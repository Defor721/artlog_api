import { Test, TestingModule } from '@nestjs/testing';
import { PerformancesController } from './performances.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PerformancesService } from './performances.service';

describe('PerformancesController', () => {
  let controller: PerformancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerformancesController],
      imports: [PrismaModule],
      providers: [PerformancesService],
    }).compile();

    controller = module.get<PerformancesController>(PerformancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
