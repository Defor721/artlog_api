import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(dto: CreatePostDto) {
    return this.prisma.post.create({
      data: dto,
    });
  }
}
