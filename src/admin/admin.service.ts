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
    const user = this.prisma.user.findUnique({ where: { id: userId } });
  }
}
