import { Test, TestingModule } from '@nestjs/testing';
import { DiarysController } from './diarys.controller';
import { DiarysService } from './diarys.service';

describe('DiarysController', () => {
  let controller: DiarysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiarysController],
      providers: [DiarysService],
    }).compile();

    controller = module.get<DiarysController>(DiarysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
