import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostParamDto } from './dto/postParam.dto';

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
  async getPost(dto: PostParamDto, userId: string) {
    const post = await this.prisma.post.findFirst({
      where: { id: dto.postId, userId: userId },
    });

    if (!post) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    return post;
  }
  // 전체 포스트 조회
  async getPosts(userId: string) {
    return this.prisma.post.findMany({
      where: { userId: userId },
    });
  }
  // 단일 포스트 삭제
  async deletePost(dto: PostParamDto, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: dto.postId },
    });

    if (!post) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    return this.prisma.post.delete({
      where: { id: dto.postId },
    });
  }
}
