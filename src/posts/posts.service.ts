import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostDto } from './dto/get-post.dto';
@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}
  //포스트 생성
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
  //id기반 포스트 검색
  async getPost(dto: GetPostDto, userId: string) {
    return this.prisma.post.findFirst({
      where: { id: dto.postId, userId: userId },
    });
  }
  // 전체 포스트 조회
  async getPosts(userId: string) {
    return this.prisma.post.findMany({
      where: { userId: userId },
    });
  }
}
