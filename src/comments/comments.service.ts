import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

  async updateComment(commentId: string, newContent: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('댓글을 찾을 수 없습니다');
    if (comment.authorId !== userId)
      throw new ForbiddenException('수정 권한이 없습니다');
    // 이전 댓글 저장
    await this.prisma.commentEditHistory.create({
      data: {
        commentId: comment.id,
        prevContent: comment.content,
      },
    });
    // 수정한 댓글 업데이트
    return this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: newContent,
        edited: true,
      },
    });
  }
}
