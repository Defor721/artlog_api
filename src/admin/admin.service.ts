import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}
  async getUsers() {
    return this.prisma.user.findMany();
  }

  async deleteUser() {}

  async banUser(userId) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user!) {
      throw new NotFoundException('유저를 찾을 수 없습니다');
    }
  }
}
