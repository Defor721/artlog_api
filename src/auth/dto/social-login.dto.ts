import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginType } from '@prisma/client';

export class SocialLoginDto {
  @ApiProperty({ example: 'GOOGLE', enum: LoginType })
  @IsEnum(LoginType)
  provider: LoginType;

  @ApiProperty({ example: 'google-109238091' })
  @IsString()
  providerId: string;

  @ApiProperty({ example: 'jihun@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '지훈', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'https://example.com/avatar.png', required: false })
  @IsOptional()
  @IsString()
  image?: string;
}
