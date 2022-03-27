import { NextFunction, Request, Response, Router } from 'express';
import { LoggerService } from '../logger/logger.service';

export interface IMiddleware {
  middle: (req: Request, res: Response, next: NextFunction) => void;
}

export interface IControllerRoute {
  path: string;
  func: (req: Request, res: Response, next: NextFunction) => void;
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch'>;
  middleware?: IMiddleware[];
}

export class BaseController {
  private _router: Router;

  constructor(protected logger: LoggerService) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  protected bindRoutes(routes: IControllerRoute[]) {
    for (const route of routes) {
      this.logger.log(`[${route.method.toUpperCase()}] ${route.path}`);

      const middlewares = route.middleware?.map(m => m.middle.bind(m));
      const handler = route.func.bind(this);
      const pipe = middlewares ? [...middlewares, handler] : handler;
      this._router[route.method](route.path, pipe);
    }
  }

  public send<T>(res: Response, code: number, message: T) {
    res.type('application/json');
    return res.status(code).json(message);
  }
  public ok<T>(res: Response, message: T) {
    return this.send(res, 200, message);
  }
}
