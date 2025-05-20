import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: '67c65a6d1245daeec1ab25e9' })
  @IsString()
  userId: string;

  @ApiProperty({ example: '반 고흐 회화전' })
  @IsString()
  selectedExhibition: string;

  @ApiProperty({ example: 3.5 })
  @IsInt()
  star: number;

  @ApiProperty({ example: '반 고흐 회화전' })
  @IsString()
  title: string;

  @ApiProperty({
    example: '나는 오늘 반고흐 회화전을 보러갔다 참 재밌었다 하하',
  })
  @IsString()
  detail: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({ example: ['회화', '조각', '프랑스'] })
  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @ApiProperty({ example: 'imgurl=saddfasff12klf' })
  @IsOptional()
  @IsString()
  ticket?: string;

  @ApiProperty({
    example: ['imgurl=sadasda12231', 'imgurl=dasdas', 'imgurl=qwnjqnjfk'],
  })
  @IsArray()
  @IsString({ each: true })
  photos: string[];
}
