import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../common/validate.middleware';
import { LoggerService } from '../logger/logger.service';
import { UserCreateDTO, UserLoginDTO } from '../user/user.dto';
import { Role } from '../user/user.entity';
import { AuthService } from './auth.service';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '../common/config.service';
import { HttpError } from '../error/httpError';

export class AuthController extends BaseController {
  constructor(
    private authService: AuthService,
    private service: ConfigService,
    logger: LoggerService) {
    super(logger);
    this.bindRoutes([{
      path: '/auth/login',
      method: 'post',
      func: this.login,
      middleware: [new ValidateMiddleware(UserLoginDTO)]
    },
    {
      path: '/auth/register',
      method: 'post',
      func: this.register,
      middleware: [new ValidateMiddleware(UserCreateDTO)]
    }]);
  }

  async register(req: Request<any, {}, UserCreateDTO>, res: Response, next: NextFunction) {
    try {
      const user = await this.authService.register(req.body);
      this.send(res, 200, user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request<any, {}, UserLoginDTO>, res: Response, next: NextFunction) {
    const validated = await this.authService.validateUser(req.body);
    if (!validated.isValid)
      return next(new HttpError(401, 'Authorization Error', 'login'));

    const jwt = await this.signJWT({ email: req.body.email, role: validated.role });
    this.ok(res, { jwt });
  }

  private signJWT(playload: { email: string, role: Role }): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(
        {
          ...playload,
          exp: Math.floor(Date.now() / 1000) + (60 * 60),
        },
        this.service.get('SECRET'),
        { algorithm: 'HS256' },
        (err, token) => {
          if (err)
            reject(err);
          resolve(token!);
        }
      );
    });
  }
};
