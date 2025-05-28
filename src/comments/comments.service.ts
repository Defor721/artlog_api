import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(dto: CreateCommentDto, authorId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: dto.postId },
    });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다');

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        postId: dto.postId,
        authorId,
      },
    });
  }

  async getCommentsByPost(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
