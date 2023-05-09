import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiRequestLog } from '../modules/dai/entities/api-request-log.entity';
import { Connection } from 'typeorm';

@Injectable()
export class ApiRequestLoggerMiddleware implements NestMiddleware {
  constructor(private connection: Connection) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    await next();
    const { method, originalUrl, baseUrl } = req;
    const { statusCode } = res;
    const responseTime = Date.now() - startTime;

    const apiRequestLog = this.connection.getRepository(ApiRequestLog).create({
      apiKey: (req.headers['x-api-key'] as string) || null,
      method,
      path: baseUrl + originalUrl,
      statusCode,
      responseTime,
    });
    await this.connection.getRepository(ApiRequestLog).save(apiRequestLog);
  }
}
