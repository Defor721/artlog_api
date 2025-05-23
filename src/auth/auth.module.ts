import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BcryptWorkerService } from 'src/workers/bcrypt.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { NaverStrategy } from './strategies/naver.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    RedisModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    AuthService,
    BcryptWorkerService,
    GoogleStrategy,
    JwtStrategy,
    NaverStrategy,
    KakaoStrategy,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
