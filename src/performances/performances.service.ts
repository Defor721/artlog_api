import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class PerformancesService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async getPerformances() {
    const cached = await this.cacheManager.get('performances');
    if (cached) {
      return cached;
    }
    const data = await this.prisma.performance.findMany();
    await this.cacheManager.set('performances', data, 60000); // 60초간 캐시(밀리초).cachemanager 5.0 이상부터 밀리초 단위로 변경됨
    return data;
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
