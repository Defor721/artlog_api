import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/auth/naver/callback',
    });
  }

  async validate(_: any, __: any, profile: any) {
    const json = profile._json;

    return {
      provider: 'NAVER',
      providerId: json.id,
      email: json.email,
      name: json.name,
      image: json.profile_image,
    };
  }
}
