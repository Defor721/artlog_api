import { PostsService } from './posts.service';
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: '게시물 포스팅' })
  @ApiResponse({ status: 200, description: '포스트 생성 완료' })
  @UseGuards(AuthGuard('jwt'))
  uploadPost(dto: CreatePostDto) {
    return this.postsService.createPost(dto);
  }
}
