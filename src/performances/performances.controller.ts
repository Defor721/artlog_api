import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PerformancesService } from './performances.service';

@ApiTags('performances')
@Controller('performances')
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  @Get()
  @ApiOperation({ summary: '모든 공연 조회' })
  @ApiResponse({ status: 200, description: '전체 공연 리스트 반환' })
  getPerformances() {
    return this.performancesService.getPerformances();
  }

  @Get('seq/:seq') // GET /performances/seq/1234 형식
  @ApiOperation({ summary: '공연 상세 조회 (seq 기준)' })
  @ApiResponse({ status: 200, description: '공연 정보 반환' })
  getPerformance(@Param('seq') seq: string) {
    return this.performancesService.getPerformance(seq);
  }

  @Get('area')
  @ApiOperation({ summary: '지역별 공연 조회' })
  @ApiResponse({ status: 200, description: '지역별 공연 리스트 반환' })
  getByArea(@Query('area') area: string) {
    return this.performancesService.getPerformancesByArea(area);
  }

  @Get('date')
  @ApiOperation({ summary: '특정 날짜 기준 공연 조회' })
  @ApiResponse({
    status: 200,
    description: '해당 날짜에 포함된 공연 리스트 반환',
  })
  getByDate(@Query('date') date: string) {
    return this.performancesService.getPerformancesByDate(date);
  }

  @Get('search')
  @ApiOperation({ summary: '공연 제목/장소 검색' })
  @ApiResponse({ status: 200, description: '검색 결과 반환' })
  search(@Query('keyword') keyword: string) {
    return this.performancesService.searchPerformances(keyword);
  }

  @Get('page')
  @ApiOperation({ summary: '공연 목록 페이지네이션 조회' })
  @ApiResponse({ status: 200, description: '페이지네이션된 공연 리스트 반환' })
  getPaginated(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    return this.performancesService.getPerformancesPaginated(skip, take);
  }
}
