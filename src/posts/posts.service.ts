import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(dto: CreatePostDto, userId: string) {
    return this.prisma.post.create({
      //create로 넘길땐 반드시 data 안에.
      data: {
        ...dto,
        user: {
          connect: { id: userId }, //relation이 설정되어 있으면 직접 할당 불가
        },
      },
    });
  }
}
