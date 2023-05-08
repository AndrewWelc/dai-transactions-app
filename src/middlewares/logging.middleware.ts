import { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from '../logger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const { method, path, query } = req;
    logger.info(`${method} ${path} ${JSON.stringify(query)}`);
    next();
  }
}
