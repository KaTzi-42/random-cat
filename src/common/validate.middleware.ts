import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../error/httpError';
import { IMiddleware } from './base.controller';

export class ValidateMiddleware implements IMiddleware {
  constructor(private classValidate: ClassConstructor<object>) { }

  async middle(req: Request, res: Response, next: NextFunction) {
    try {
      const entity = plainToClass(this.classValidate, req.body, { excludeExtraneousValues: true });
      await validateOrReject(entity);
      req.body = entity;
      next();
    } catch (error) {
      next(new HttpError(422, 'Validate error', error));
    }
  }
}
