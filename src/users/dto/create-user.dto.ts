import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'jihun@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '지훈', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
