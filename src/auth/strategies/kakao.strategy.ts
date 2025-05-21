import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID!, //단언해라
      callbackURL: 'http://localhost:3000/auth/kakao/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const kakaoAccount = profile._json?.kakao_account;
    const properties = profile._json?.properties;

    return {
      provider: 'KAKAO',
      providerId: profile.id.toString(), // kakao는 providerId가 number로 들어와서 string으로
      email: kakaoAccount?.email ?? `kakao_${profile.id}@noemail.com`, //email 안들어오면 기본이메일
      name: profile.username ?? properties?.nickname,
      image: properties?.profile_image,
    };
  }
}
