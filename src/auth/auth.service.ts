import { Injectable } from '@nestjs/common';
import { BcryptWorkerService } from '../workers/bcrypt.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginType } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private bcryptService: BcryptWorkerService,
    private prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password } = dto;
    const name = dto.name ?? '익명사용자';
    const hashed = await this.bcryptService.hash(password);
    return this.prisma.user.create({
      data: { email, password: hashed, name, loginType: 'LOCAL' },
    });
  }

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
    if (!isMatch) throw new Error('Invalid credentials');

    return user;
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
    const user = await this.prisma.user.findFirst({
      where: { providerId, loginType: provider },
    });

    if (user) {
      return user; // 기존 유저 → 로그인 처리
    }

    // 없으면 새로 등록
    return this.prisma.user.create({
      data: {
        email,
        name,
        image,
        loginType: provider,
        providerId,
      },
    });
  }
}
