import {
  NestMiddleware,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from './logger';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  private readonly apiKey = process.env.API_KEY;

  use(req: Request, res: Response, next: () => void) {
    const apiKeyHeader = req.header('X-API-KEY');

    if (!apiKeyHeader || apiKeyHeader !== this.apiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    next();
  }
}

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const { method, path, query } = req;
    logger.info(`${method} ${path} ${JSON.stringify(query)}`);
    next();
  }
}
