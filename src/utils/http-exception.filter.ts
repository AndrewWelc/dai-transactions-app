import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      error instanceof HttpException
        ? error.getResponse()
        : { message: 'Internal server error' };

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message,
    };

    // Log the error details
    console.error(errorResponse);

    res.status(status).json(errorResponse);
  }
}
