import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status = exception.getStatus();
    const message = exception.message;
    const userId = request.user?.id ?? 'anonymous';

    this.logger.error(
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
