import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PerformancesService {
  constructor(private prisma: PrismaService) {}

  async getPerformances() {
    return this.prisma.performance.findMany();
  }

  async getPerformance(seq: string) {
    const performance = await this.prisma.performance.findUnique({
      where: { seq: seq },
    });
    //findUnique는 대상을 찾지 못하면 null 반환하므로 예외처리할것
    if (!performance) {
      throw new NotFoundException('해당 공연을 찾을 수 없습니다');
    }
    return performance;
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
  async searchPerformances(keyword: string) {
    return this.prisma.performance.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { place: { contains: keyword, mode: 'insensitive' } },
        ],
      },
    });
  }
  async getPerformancesPaginated(skip: number, take: number) {
    return this.prisma.performance.findMany({
      skip,
      take,
      orderBy: { startDate: 'asc' },
    });
  }
}
