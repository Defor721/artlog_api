import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        // 콘솔 로그
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `[${timestamp}] ${level} ${context || ''} - ${message}`;
            }),
          ),
        }),
        // 날짜별 로그 파일 저장
        new DailyRotateFile({
          dirname: 'logs', // 저장 디렉토리
          filename: 'error-%DATE%.log', // 파일 이름 패턴
          datePattern: 'YYYY-MM-DD', // 일자별
          level: 'error', // error 레벨만 저장
          zippedArchive: true, // 오래된 로그는 zip 압축
          maxSize: '20m', // 파일 최대 크기
          maxFiles: '14d', // 최대 14일 보관
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
