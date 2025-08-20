import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
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
