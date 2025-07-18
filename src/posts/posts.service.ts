import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostParamDto } from './dto/postParam.dto';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async createPost(
    dto: CreatePostDto,
    userId: string,
    files: Express.Multer.File[],
  ) {
    // 포스트 생성(s3에 postid 저장을 위해)
    const post = await this.prisma.post.create({
      data: {
        ...dto,
        user: {
          connect: { id: userId },
        },
      },
    });
    // 이미지 S3 업로드
    const uploadedImages = await this.s3Service.uploadFiles(
      userId,
      post.id,
      files,
    );
    // 각 이미지 DB 저장(url)
    for (const img of uploadedImages) {
      await this.prisma.photo.create({
        data: {
          postId: post.id,
          s3Key: img.key,
          url: img.url,
        },
      });
    }
    return {
      post,
      photos: uploadedImages.map((img) => img.url),
    };
  }

  //id기반 포스트 검색
  async getPost(dto: PostParamDto, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: dto.postId },
      include: { photos: true }, //  사진까지 같이 가져오기
    });

    if (!post) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
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
      include: { photos: true }, //  사진까지 같이 가져오기
    });
    if (!post) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }
    if (post.userId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }
    //  S3에서 이미지 삭제
    const s3Keys = post.photos.map((photo) => photo.s3Key);
    if (s3Keys.length > 0) {
      await this.s3Service.deleteFiles(s3Keys);
    }
    //  DB에서 Photo 레코드 삭제
    await this.prisma.photo.deleteMany({
      where: { postId: dto.postId },
    });
    //  DB에서 Post 레코드 삭제
    return this.prisma.post.delete({
      where: { id: dto.postId },
    });
  }
  //관리자용 api
  async deletePostByAdmin(dto: PostParamDto, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: dto.postId },
      include: { photos: true }, //  사진까지 같이 가져오기
    });
    if (!post) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }
    if (post.userId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }
    //  S3에서 이미지 삭제
    const s3Keys = post.photos.map((photo) => photo.s3Key);
    if (s3Keys.length > 0) {
      await this.s3Service.deleteFiles(s3Keys);
    }
    //  DB에서 Photo 레코드 삭제
    await this.prisma.photo.deleteMany({
      where: { postId: dto.postId },
    });
    //  DB에서 Post 레코드 삭제
    return this.prisma.post.delete({
      where: { id: dto.postId },
    });
  }
}
