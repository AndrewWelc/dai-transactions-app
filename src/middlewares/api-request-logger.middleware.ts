import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiRequestLog } from '../modules/dai/entities/api-request-log.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ApiRequestLoggerMiddleware implements NestMiddleware {
  constructor(private dataSource: DataSource) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    await next();
    const { method, originalUrl, baseUrl } = req;
    const { statusCode } = res;
    const responseTime = Date.now() - startTime;

    const apiRequestLog = this.dataSource.getRepository(ApiRequestLog).create({
      apiKey: (req.headers['x-api-key'] as string) || null,
      method,
      path: baseUrl + originalUrl,
      statusCode,
      responseTime,
    });
    await this.dataSource.getRepository(ApiRequestLog).save(apiRequestLog);
  }
}
