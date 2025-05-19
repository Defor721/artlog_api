import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'jihun@example.com' }) //swagger에 표시되는 부분
  @IsEmail()
  email: string;

  @ApiProperty({ example: '지훈', required: false }) //swagger에 표시되는 부분 required:false가 없으면 필수값으로 표시됨
  @IsOptional() // 이 항목이 없어도 유효한 요청으로 처리되도록 함
  @IsString()
  name?: string;
}
