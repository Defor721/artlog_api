import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, body } = request;
    const userId = request.user?.id ?? 'anonymous';

    // 민감 경로 제외
    const shouldSkip = ['/auth/login', '/auth/register'].includes(originalUrl);

    return next.handle().pipe(
      map((responseData) => {
        const delay = Date.now() - now;

        if (!shouldSkip) {
          this.logger.log(
            `[${method}] ${originalUrl} ${delay}ms\n🧑 User: ${userId}\n👉 Request: ${JSON.stringify(body)}`,
            context.getClass().name,
          );
        } else {
          this.logger.log(
            `[${method}] ${originalUrl} ${delay}ms (request logging skipped)`,
            context.getClass().name,
          );
        }

        return responseData;
      }),
    );
  }
}
