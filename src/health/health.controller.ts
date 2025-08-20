// health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService, //Terminus 제공. service 따로 만들 필요 없음.
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // 간단히 Nest 앱 자체 헬스 체크 (예: 구글 핑)
      async () => this.http.pingCheck('google', 'https://www.google.com'),
    ]);
  }
}
