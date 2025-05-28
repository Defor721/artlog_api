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

    const updatedHistory = Array.isArray(comment.editHistory) // prisma는 mongodb 기준으로 배열 타입을 지정할 수 없음. json타입으로 다뤄야 하기 때문에 TS쪽에서 방어 코드를 넣어줘야 함.
      ? [...comment.editHistory]
      : [];

    updatedHistory.push({
      previousContent: comment.content,
      editedAt: new Date().toISOString(),
    });

    return this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: newContent,
        edited: true,
        editHistory: updatedHistory,
      },
    });
  }
}
