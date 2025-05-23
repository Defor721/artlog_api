import { WinstonModule } from 'nest-winston';
import { Module } from '@nestjs/common';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `[${timestamp}] ${level} ${context || ''} - ${message}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log', //로그 파일 저장 경로
          level: 'error', // 에러 이상(error,critical,fatal등)
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(), //json형식으로 저장
          ),
        }),
      ],
    }),
  ],
  exports: [WinstonModule], // 다른 모듈에서 사용할 수 있게 export
})
export class LoggerModule {}
