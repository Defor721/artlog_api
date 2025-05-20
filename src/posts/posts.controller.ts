import { PostsService } from './posts.service';
import { Controller, Body, Post, UseGuards, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostDto } from './dto/get-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: '게시물 포스팅' })
  @ApiResponse({ status: 200, description: '포스트 생성 완료' })
  @UseGuards(AuthGuard('jwt'))
  uploadPost(@Body() dto: CreatePostDto, @User('userId') userId: string) {
    return this.postsService.createPost(dto, userId);
  }

  @Get(':postId')
  @UseGuards(AuthGuard('jwt'))
  getPost(@Param() dto: GetPostDto, @User('userId') userId: string) {
    return this.postsService.getPost(dto, userId);
  }
}
