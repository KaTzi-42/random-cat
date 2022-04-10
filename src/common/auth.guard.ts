import { Request, Response, NextFunction } from 'express';
import { Role } from '../user/user.entity';
import { IMiddleware } from './base.controller';

export class AuthGuard implements IMiddleware {
  constructor(private roles: Role[]) { }

  async middle(req: Request, res: Response, next: NextFunction) {
    if (req.user && this.roles.includes(req.user.role as Role))
      return next();

    res.status(401).send({ error: 'Not authorized' });
  }
}
