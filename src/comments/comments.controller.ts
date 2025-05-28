import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../common/decorators/user.decorator';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: '댓글 작성' })
  @ApiResponse({ status: 200, description: '댓글 작성 완료' })
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreateCommentDto, @User('userId') userId: string) {
    return this.commentsService.createComment(dto, userId);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: '댓글 조회' })
  @ApiResponse({ status: 200, description: '댓글 조회 완료' })
  getCommentsByPost(@Param('postId') postId: string) {
    return this.commentsService.getCommentsByPost(postId);
  }
}
