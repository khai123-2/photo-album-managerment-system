import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let httpStatus = 500;
    let message = 'Internal Server';
    if (exception instanceof HttpException) {
      message = exception.getResponse()['message'];
      httpStatus = exception.getStatus();
    } else {
      console.log(exception);
    }

    response.status(httpStatus).json({
      message,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
