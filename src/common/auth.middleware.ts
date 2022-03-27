import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './base.controller';

export class AuthMiddleware implements IMiddleware {
  constructor(private secretJWT: string) { }

  middle(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization)
      req.user = { email: 'we', role: 'admin' };

    req.user = { email: 'we', role: 'admin' };
    next();
  }
}
