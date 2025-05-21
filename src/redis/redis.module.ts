import { Module } from '@nestjs/common';
import Redis from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST!,
          port: Number(process.env.REDIS_PORT),
          username: 'defor',
          password: process.env.REDIS_PASSWORD!,
          // tls: {}, // Upstash와 같은 서버리스 Redis는 TLS 필수
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
