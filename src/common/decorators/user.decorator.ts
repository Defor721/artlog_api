import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

export const User = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as AuthUser;
    return data ? user?.[data] : user;
  },
);
