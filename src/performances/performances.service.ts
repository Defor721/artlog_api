import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PerformancesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.performance.findMany();
  }
}
