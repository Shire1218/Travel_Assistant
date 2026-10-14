import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/** 统一异常响应结构：{ code, message, data: null }，code 为业务/HTTP 状态码 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : ((res as Record<string, unknown>).message as string) ??
            exception.message;
      // class-validator 校验失败时 message 为数组，拼接为字符串
      if (Array.isArray(message)) {
        message = message.join('; ');
      }
    } else {
      this.logger.error(exception);
    }

    response.status(status).json({
      code: status,
      message,
      data: null,
    });
  }
}
