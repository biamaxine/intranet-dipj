import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export abstract class ClearCacheMiddleware {
  static use(req: Request, res: Response, next: () => void): void {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    next();
  }
}
