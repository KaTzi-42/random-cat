import express from 'express';
import { CatController } from './cats/cats.controller';
import { AuthMiddleware } from './common/auth.middleware';
import { ConfigService } from './common/config.service';
import { ExeptionFilter } from './error/exeptionFilter';
import { LoggerService } from './logger/logger.service';
import { UserController } from './user/user.controller';
import cors from 'cors';

export class App {
  private app: express.Application;
  port: number;

  constructor(
    private logger: LoggerService,
    private catController: CatController,
    private userController: UserController,
    private exeptionFilter: ExeptionFilter,
    private config: ConfigService,
  ) {
    this.app = express();
  }

  private useMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    const authMiddleware = new AuthMiddleware(this.config.get('SECRET'));
    this.app.use(authMiddleware.middle.bind(authMiddleware));
  }

  private useRoutes() {
    this.app.use('/api/v1/', this.catController.router);
    this.app.use('/api/v1/', this.userController.router);
  }

  public async initialize(port?: number) {
    this.app.use(cors());
    this.useMiddleware();
    this.app.use(this.logger.requestLogger.bind(this.logger));
    this.useRoutes();
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));

    this.port = port ?? parseInt(process.env.PORT!);

    this.app.listen(this.port, () => {
      console.log(`Server start on ${this.port}`);
    });
  }

}
