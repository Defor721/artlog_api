import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PerformancesService {
  constructor(private prisma: PrismaService) {}

  async getPerformances() {
    return this.prisma.performance.findMany();
  }

  async getPerformance(performanceId: string) {
    return this.prisma.performance.findUnique({
      where: { id: performanceId },
    });
  }

  async getPerformancesByArea(area: string) {
    return this.prisma.performance.findMany({
      where: { area: area },
    });
  }

  async getPerformancesByDate(date: string) {
    return this.prisma.performance.findMany({
      where: { startDate: { lte: date }, endDate: { gte: date } },
    });
  }
}
