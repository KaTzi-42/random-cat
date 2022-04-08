import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserCreateDTO, UserLoginDTO } from './user.dto';
import { ValidateMiddleware } from '../common/validate.middleware';
import { HttpError } from '../error/httpError';

export class UserController extends BaseController {
  constructor(
    private userService: UserService,
    logger: LoggerService
  ) {
    super(logger);
    this.bindRoutes([{
      path: '/users',
      method: 'post',
      func: this.create,
      middleware: [new ValidateMiddleware(UserCreateDTO)]
    },
    {
      path: '/users',
      method: 'delete',
      func: this.delete,
    },
    {
      path: '/users/:userId',
      method: 'get',
      func: this.findOne,
    }
    ]);
  }

  async create(req: Request<any, {}, UserCreateDTO>, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.create(req.body);
      this.send(res, 200, { id: user.id, email: user.email });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    throw new HttpError(500, 'Delete method empty');
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    throw new HttpError(500, 'FindOne method empty');
  }
}
