import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginType } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 일반 로그인
  @Post('login')
  @ApiOperation({ summary: '일반 로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // 소셜 로그인 (예: GoogleStrategy에서 req.user에 담긴 값)
  @Post('social-login')
  socialLogin(
    @Body()
    body: {
      provider: LoginType;
      providerId: string;
      email: string;
      name?: string;
      image?: string;
    },
  ) {
    return this.authService.loginSocial(body);
  }
}
