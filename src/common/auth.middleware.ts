import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { Role } from '../user/user.entity';
import { IMiddleware } from './base.controller';

export interface ITokenPlayload {
  email: string;
  role: Role;
  iat: number;
}

export class AuthMiddleware implements IMiddleware {
  constructor(private secretJWT: string) { }

  middle(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers.authorization) {
        const playload = verify(
          req.headers.authorization.split(' ')[1],
          this.secretJWT) as ITokenPlayload;

        req.user = { email: playload.email, role: playload.role };
      }
      next();
    } catch (error) {
      next();
    }
  }
}
