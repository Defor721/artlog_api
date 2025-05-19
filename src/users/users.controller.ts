import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users') // Swagger 태그
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '모든 유저 조회' })
  @ApiResponse({ status: 200, description: '유저 목록 반환' })
  getUsers() {
    return this.usersService.findAll();
  }
}
