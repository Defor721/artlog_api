import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginType } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 일반 로그인
  @Post('login')
  @ApiOperation({ summary: '일반 로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  // 소셜 로그인 (예: GoogleStrategy에서 req.user에 담긴 값)
  @Post('social-login')
  socialLogin(@Body() dto: SocialLoginDto) {
    return this.authService.loginSocial(dto);
  }
  // 회원가입
  @Post('register')
  @ApiOperation({ summary: '회원 가입' })
  @ApiResponse({ status: 200, description: '회원 가입 성공' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
