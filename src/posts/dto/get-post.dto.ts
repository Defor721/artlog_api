import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetPostDto {
  @ApiProperty()
  @IsString()
  postId: string;
}
