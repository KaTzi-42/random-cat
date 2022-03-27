import { config } from 'dotenv';
import { createConnection } from 'typeorm';
config();
import configDb from './db/ormconfig';
import { App } from './app';
import { CatController } from './cats/cats.controller';
import { CatService } from './cats/cats.service';
import { LoggerService } from './logger/logger.service';
import { UserController } from './user/user.controller';
import { FileManager } from './utils/fileManager';
import { ExeptionFilter } from './error/exeptionFilter';
import { UserService } from './user/user.service';
import { ConfigService } from './common/config.service';
import { fileFilter, storage } from './utils/file.options';

const startUp = async () => {
  const config = ConfigService.getInstance();

  const file = new FileManager({
    fileFilter,
    storage
  });

  const db = await createConnection(configDb);
  console.log(db.isConnected);

  const logger = LoggerService.getInstance();
  const app = new App(
    logger,
    new CatController(new CatService(), file, logger),
    new UserController(new UserService(config), logger),
    new ExeptionFilter(logger),
    config
  );

  await app.initialize(3001);
};

startUp();




