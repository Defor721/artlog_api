import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const options: StrategyOptions = {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, //단언하지 않으면 에러
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    };

    super(options);
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      provider: 'GOOGLE',
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      image: profile.photos?.[0]?.value,
    };
  }
}
