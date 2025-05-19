import { PerformancesService } from './performances.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('performances')
@Controller('performances')
export class PerformancesController {
  constructor(private readonly PerformancesService: PerformancesService) {}
}
