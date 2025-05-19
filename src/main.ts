import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
