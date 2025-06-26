import { Test, TestingModule } from '@nestjs/testing';
import { DiarysService } from './diarys.service';

describe('DiarysService', () => {
  let service: DiarysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiarysService],
    }).compile();

    service = module.get<DiarysService>(DiarysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
