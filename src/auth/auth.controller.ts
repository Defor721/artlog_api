import { Controller } from '@nestjs/common';
import { Body, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginType } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

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
  @ApiOperation({ summary: '소셜 로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  socialLogin(@Body() dto: SocialLoginDto) {
    return this.authService.loginSocial(dto);
  }
  // 회원가입
  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 200, description: '회원가입 성공' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // 리다이렉트 되므로 로직 불필요
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req) {
    const { provider, providerId, email, name, image } = req.user;
    return this.authService.loginSocial({
      provider,
      providerId,
      email,
      name,
      image,
    });
  }

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin() {
    // 리다이렉트 되므로 로직 불필요
  }

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverCallback(@Req() req) {
    const { provider, providerId, email, name, image } = req.user;
    return this.authService.loginSocial({
      provider,
      providerId,
      email,
      name,
      image,
    });
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    // 리다이렉트 되므로 로직 불필요
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req) {
    const { provider, providerId, email, name, image } = req.user;
    return this.authService.loginSocial({
      provider,
      providerId,
      email,
      name,
      image,
    });
  }
}
