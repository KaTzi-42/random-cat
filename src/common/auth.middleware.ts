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

  async middle(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers.authorization) {
        const playload = await this.verifyJWT(req.headers.authorization.split(' ')[1]);
        req.user = { email: playload.email, role: playload.role };
      }
      next();
    } catch (error) {
      next();
    }
  }

  private verifyJWT(token: string): Promise<ITokenPlayload> {
    return new Promise((resolve, reject) => {
      verify(token, this.secretJWT, (error, playload) => {
        if (error)
          reject(error);
        resolve(playload as ITokenPlayload);
      });
    });
  }
}
