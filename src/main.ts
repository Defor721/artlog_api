import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true }); //초기 로딩 중 에러나 경고 저장
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3001', // 프론트 도메인
    credentials: true, // ✅ 쿠키 전송 허용
  });
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger); // winston을 Nest 전역 로거로 설정(로거파일생성&앱모듈등록&전역로거설정)
  const config = new DocumentBuilder()
    .setTitle('ArtLog API')
    .setDescription('ArtLog API Document')
    .setVersion('1.0')
    .addTag('users', 'performances') // 원하는 태그 추가
    .build();
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // /api-docs 경로에서 Swagger 열림
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
