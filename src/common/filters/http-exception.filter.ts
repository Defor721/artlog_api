import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from '@nestjs/common';

@Catch(HttpException) //HttpException만 처리하도록 지정
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) //Logger 인스턴스 주입
    private readonly logger: Logger, // 주입받은 Logger 사용가능하게 변형
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    // catch: Exception 필터의 핵심 메서드로, 예외가 발생할 때 이 메서드가 실행
    const ctx = host.switchToHttp(); //현재 컨텍스트를 http로 전환
    const request = ctx.getRequest(); // 실제 express의 req 객체
    const response = ctx.getResponse(); // 실제 express의 res 객체

    const status = exception.getStatus(); // 예외 객체에서 상태 코드 (401,403등) 가져옴
    const message = exception.message; // 예외 메시지 내용
    const userId = request.user?.id ?? 'anonymous';

    this.logger.error(
      // 윈스턴 로거로 에러 로그 출력
      `[${request.method}] ${request.url} ${status} ERROR\n🧑 User: ${userId}\n❌ Message: ${message}`,
      exception.stack,
      'HttpExceptionFilter',
    );

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
