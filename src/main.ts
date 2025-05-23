import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3001', // 프론트 도메인
    credentials: true, // ✅ 쿠키 전송 허용
  });
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger); // winston을 Nest 전역 로거로 설정
  const config = new DocumentBuilder()
    .setTitle('ArtLog API')
    .setDescription('ArtLog API Document')
    .setVersion('1.0')
    .addTag('users', 'performances') // 원하는 태그 추가
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // /api-docs 경로에서 Swagger 열림
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
