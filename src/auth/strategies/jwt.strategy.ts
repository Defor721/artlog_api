import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //jwt 토큰 추출
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!, //단언하지 않으면 에러
    };

    super(options);
  }

  async validate(payload: { sub: number; email?: string; role: string }) {
    return { userId: payload.sub, email: payload.email, role: payload.role }; //
  }
}
