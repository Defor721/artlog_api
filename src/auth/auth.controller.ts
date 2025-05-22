import { Controller } from '@nestjs/common';
import {
  Body,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginType } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express'; // res,req.cookie 사용하기 위해서 필요

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 일반 로그인
  @Post('login')
  @ApiOperation({ summary: '일반 로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.login(
      dto.email,
      dto.password,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return { user, accessToken };
  }
  // 로그아웃
  @Post('logout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req) {
    const userId = req.user.userId;
    await this.authService.deleteRefreshToken(userId);
    return { message: '로그아웃 완료' };
  }

  // 소셜 로그인 (예: GoogleStrategy에서 req.user에 담긴 값)
  @Post('social-login')
  @ApiOperation({ summary: '소셜 로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  async socialLogin(
    @Body() dto: SocialLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.loginSocial(dto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { user, accessToken };
  }
  // 회원가입
  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 200, description: '회원가입 성공' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  // 구글 로그인
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // 리다이렉트 되므로 로직 불필요
  }
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { provider, providerId, email, name, image } = req.user;
    const { user, accessToken, refreshToken } =
      await this.authService.loginSocial({
        provider,
        providerId,
        email,
        name,
        image,
      });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return { user, accessToken };
  }
  // 네이버 로그인
  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin() {
    // 리다이렉트 되므로 로직 불필요
  }
  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { provider, providerId, email, name, image } = req.user;
    const { user, accessToken, refreshToken } =
      await this.authService.loginSocial({
        provider,
        providerId,
        email,
        name,
        image,
      });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { user, accessToken };
  }
  // 카카오 로그인
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    // 리다이렉트 되므로 로직 불필요
  }
  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { provider, providerId, email, name, image } = req.user;
    const { user, accessToken, refreshToken } =
      await this.authService.loginSocial({
        provider,
        providerId,
        email,
        name,
        image,
      });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { user, accessToken };
  }
  //토큰 재발급
  @Post('refresh')
  @ApiOperation({ summary: '토큰 재발급' })
  @ApiResponse({ status: 200, description: '재발급 성공' })
  async refresh(@Req() req: Request) {
    const token = req.cookies?.refreshToken;
    if (!token) throw new UnauthorizedException('Refresh token not found');
    return this.authService.refreshAccessToken(token);
  }
}
