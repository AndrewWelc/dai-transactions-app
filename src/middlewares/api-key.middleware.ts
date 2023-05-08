import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

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
