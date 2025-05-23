import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { BcryptWorkerService } from '../workers/bcrypt.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginType } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    //redis client 주입 ('REDIS_CLIENT'라는 토큰 이름으로 등록된 Provider를 주입)
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private bcryptService: BcryptWorkerService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  // 리프레시 토큰 저장
  async storeRefreshToken(userId: string, token: string) {
    await this.redisClient.set(
      `refresh:${userId}`,
      token,
      'EX',
      60 * 60 * 24 * 7,
    ); // 7일
  }
  // 리프레시 토큰 삭제
  async deleteRefreshToken(userId: string) {
    await this.redisClient.del(`refresh:${userId}`);
  }

  async validateRefreshToken(userId: string, token: string): Promise<boolean> {
    const stored = await this.redisClient.get(`refresh:${userId}`);
    return stored === token;
  }
  // 회원가입
  async register(dto: RegisterDto) {
    const { email, password } = dto;
    const name = dto.name ?? '익명사용자';
    const hashed = await this.bcryptService.hash(password);
    return this.prisma.user.create({
      data: { email, password: hashed, name, loginType: 'LOCAL' },
    });
  }
  // 로그인
  async login(email: string, plainPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Not found');

    if (!user.password) {
      throw new Error('Password not set. This may be a social login account.');
    }
    const isMatch = await this.bcryptService.compare(
      plainPassword,
      user.password,
    );
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    // 액세스 토큰 생성
    const accessToken = await this.jwtService.signAsync(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET,
      },
    );
    // 리프레시 토큰 생성
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      },
    );
    // Redis에 저장
    await this.redisClient.set(
      `refresh:${user.id}`,
      refreshToken,
      'EX',
      60 * 60 * 24 * 7, // 7일
    );
    return { user, accessToken, refreshToken };
  }
  async loginSocial({
    provider,
    providerId,
    email,
    name,
    image,
  }: {
    provider: LoginType;
    providerId: string;
    email: string;
    name?: string;
    image?: string;
  }) {
    let user = await this.prisma.user.findFirst({
      where: { providerId, loginType: provider },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          image,
          loginType: provider,
          providerId,
        },
      });
    }

    //  Access Token 발급
    const accessToken = await this.jwtService.signAsync(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET,
      },
    );
    //  Refresh Token 발급
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      },
    );

    //  Redis에 저장
    await this.redisClient.set(
      `refresh:${user.id}`,
      refreshToken,
      'EX',
      60 * 60 * 24 * 7, // 7일
    );

    return { user, accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    let payload: any;

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (e) {
      throw new ForbiddenException('유효하지 않은 토큰입니다.');
    }

    const userId = payload.sub;

    //  Redis에 저장된 토큰 확인
    const stored = await this.redisClient.get(`refresh:${userId}`);
    if (!stored || stored !== refreshToken) {
      throw new ForbiddenException(
        '이미 만료되었거나 일치하지 않는 토큰입니다.',
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('사용자를 찾을 수 없습니다.');

    //  새 access token 발급
    const accessToken = await this.jwtService.signAsync(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET,
      },
    );

    return { accessToken };
  }
}
