import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>( // getAllAndOverride = ROLES_KEY로 저장된 메타데이터를 우선순위에서 순서대로 찾아서 가장 먼저 발견된 값 반환
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    //context.getHandler=현재 실행중인 라우트 함수 context.getClass=현재 컨트롤러 클래스
    //이게 시작 조건이고. 함수에 달려있는지 클래스에 달려있는지 판별하는거
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    //context=실행 컨텍스트 switchToHttp= 현재 HTTP 요청, getRequest=실제 req객체
    // const { user } = req;
    if (!user || !requiredRoles.includes(user.role)) {
      throw new UnauthorizedException('권한이 없습니다.');
    }
    return true;
  }
}
