import { PostsService } from './posts.service';
import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { PostParamDto } from './dto/postParam.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FilesInterceptor('images')) // form-data의 파일 필드 이름
  async uploadPost(
    @Body() dto: CreatePostDto,
    @User('userId') userId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.postsService.createPost(dto, userId, files);
  }

  @Get(':postId')
  @ApiOperation({ summary: '게시물 상세 조회' })
  @ApiResponse({ status: 200, description: '게시물 상세 조회 완료' })
  @ApiResponse({ status: 404, description: '게시물이 존재하지 않음' })
  @ApiResponse({ status: 403, description: '삭제 권한 없음' })
  @UseGuards(AuthGuard('jwt'))
  getPost(@Param() dto: PostParamDto, @User('userId') userId: string) {
    return this.postsService.getPost(dto, userId);
  }

  @Delete(':postId')
  @ApiOperation({ summary: '게시물 삭제' })
  @ApiResponse({ status: 200, description: '게시물 삭제 완료' })
  @ApiResponse({ status: 404, description: '게시물이 존재하지 않음' })
  @ApiResponse({ status: 403, description: '삭제 권한 없음' })
  @UseGuards(AuthGuard('jwt'))
  deletePost(@Param() dto: PostParamDto, @User('userId') userId: string) {
    return this.postsService.deletePost(dto, userId);
  }
}
