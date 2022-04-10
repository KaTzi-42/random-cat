import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { UserService } from './user.service';
import { UserCreateDTO, UserUpdateDTO } from './user.dto';
import { ValidateMiddleware } from '../common/validate.middleware';
import { HttpError } from '../error/httpError';
import { AuthGuard } from '../common/auth.guard';
import { Role } from './user.entity';

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
      middleware: [new AuthGuard([Role.Admin])]
    },
    {
      path: '/users/:userId',
      method: 'put',
      func: this.update,
      middleware: [
        new ValidateMiddleware(UserUpdateDTO),
        new AuthGuard([Role.User, Role.Admin])]
    },
    {
      path: '/users/:userId',
      method: 'get',
      func: this.findOne,
      middleware: [new AuthGuard([Role.User, Role.Admin])]
    },
    ]);
  }

  async create(req: Request<any, {}, UserCreateDTO>, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.create(req.body);
      this.send(res, 201, { id: user.id, email: user.email });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { raw } = await this.userService.delete(+req.params.catId);
      if (!raw.length)
        return next(new HttpError(404, `Error, not usert with id - ${req.params.catId}`));

      this.ok(res, `User with id ${req.params.catId} deleted.`);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<any, {}, UserUpdateDTO>, res: Response, next: NextFunction) {
    try {
      req.body.id = +req.params.userId;
      if (req.user.role !== Role.Admin)
        delete req.body.role;

      const { password, ...updatedUser } = await this.userService.update(req.body);
      this.ok(res, updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async findOne({ user, params }: Request, res: Response, next: NextFunction) {
    try {
      const userInfo = await this.userService.findById(+params.userId);
      if (!userInfo)
        return next(new HttpError(404, 'User not found'));

      if (user.role !== Role.Admin && user.email !== userInfo.email)
        return next(new HttpError(401, 'Not authorized'));

      this.ok(res, { id: userInfo.id, email: userInfo.email, name: userInfo.name });
    } catch (error) {
      next(error);
    }
  }
}
