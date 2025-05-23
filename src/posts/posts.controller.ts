import { PostsService } from './posts.service';
import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { PostParamDto } from './dto/postParam.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: '게시물 목록 조회' })
  @ApiResponse({ status: 200, description: '게시물 목록 조회 완료' })
  @UseGuards(AuthGuard('jwt'))
  getPosts(@User('userId') userId: string) {
    return this.postsService.getPosts(userId);
  }

  @Post()
  @ApiOperation({ summary: '게시물 포스팅' })
  @ApiResponse({ status: 200, description: '포스트 생성 완료' })
  @UseGuards(AuthGuard('jwt'))
  uploadPost(@Body() dto: CreatePostDto, @User('userId') userId: string) {
    return this.postsService.createPost(dto, userId);
  }

  @Get(':postId')
  @ApiOperation({ summary: '게시물 상세 조회' })
  @ApiResponse({ status: 200, description: '게시물 상세 조회 완료' })
  @UseGuards(AuthGuard('jwt'))
  getPost(@Param() dto: PostParamDto, @User('userId') userId: string) {
    return this.postsService.getPost(dto, userId);
  }

  @Delete(':postId')
  @ApiOperation({ summary: '게시물 삭제' })
  @ApiResponse({ status: 200, description: '게시물 삭제 완료' })
  @UseGuards(AuthGuard('jwt'))
  deletePost(@Param() dto: PostParamDto, @User('userId') userId: string) {
    return this.postsService.deletePost(dto, userId);
  }
}
