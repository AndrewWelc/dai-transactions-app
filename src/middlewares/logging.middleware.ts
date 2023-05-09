import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from '../logger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const { method, path, query, body, headers } = req;
    const logData = {
      method,
      path,
      query,
      body,
      headers,
      timestamp: new Date().toISOString(),
      remoteAddress: req.ip,
    };
    logger.info(logData);
    console.log(`[${logData.timestamp}] ${method} ${path}`);
    next();
  }
}
