import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { HttpError } from './httpError';

export class ExeptionFilter {
  constructor(private logger: LoggerService) { }

  catch(err: HttpError | Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
      this.logger.error(`Error - ${err.code} : ${err.message}`, err.context);
      res.status(err.code).json({ err: err.message, context: err.context });
    } else {
      this.logger.error(`${err}`);
      res.status(500).json({ err: err.message });
    }
  }
}
