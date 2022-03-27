import { plainToClass } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../common/validate.middleware';
import { HttpError } from '../error/httpError';
import { LoggerService } from '../logger/logger.service';
import { Role } from '../user/user.entity';
import { FileManager } from '../utils/fileManager';
import { CatDTO } from './cats.dto';
import { CatService } from './cats.service';
import { FindCatOptions } from './findOptions';


export class CatController extends BaseController {
  constructor(
    private service: CatService,
    private fileService: FileManager,
    logger: LoggerService
  ) {
    super(logger);
    this.bindRoutes([
      {
        path: '/cats',
        method: 'post',
        func: this.create,
        middleware: [
          { middle: this.fileService.uploadHandler('test') },
          new ValidateMiddleware(CatDTO)]
      },
      {
        path: '/cats',
        method: 'get',
        func: this.findAll,
        //TODO добавить Проверку админа для валидации котов
      },
      {
        path: '/cats/:catId',
        method: 'get',
        func: this.findOne,
      },
      {
        path: '/cats/:catId',
        method: 'delete',
        func: this.delete,
        //TODO добавить Проверку админа
      }
    ]);
  }

  async create(req: Request<{}, {}, CatDTO>, res: Response, next: NextFunction) {
    try {
      if (!req.file)
        throw new HttpError(400, 'Отсутствует файл с котом');

      req.body.name = req.file.filename;
      const cat = await this.service.create(req.body);
      this.send(res, 201, { id: cat.id, name: cat.name, type: cat.type });
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const cat = await this.service.findById(+req.params.catId);
      if (!cat)
        return next(new HttpError(404, 'Cat not found'));

      const catStream = this.fileService.readFile(cat.name);
      res.setHeader('Content-Disposition', `inline; filename="${cat.name}"; id="${cat.id}"`);
      res.setHeader('Content-Type', `image/${cat.type}`);
      catStream.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request<{}, {}, {}, FindCatOptions>, res: Response, next: NextFunction) {
    try {
      let opt: FindCatOptions = {};
      if (req.user) {
        if (req.user.role === Role.Admin)
          opt = plainToClass(FindCatOptions, req.query, { excludeExtraneousValues: true });
      } else
        opt = {
          onValidation: undefined, onlyChecked: undefined,
          ...plainToClass(FindCatOptions, req.query, { excludeExtraneousValues: true })
        };

      const cat = await this.service.findAll(opt);
      this.send(res, 200, cat);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { raw } = await this.service.delete(+req.params.catId);
      if (!raw.length)
        return next(new HttpError(400, `Error, no cat with id - ${+req.params.catId}`));

      const [{ name }] = raw;
      await this.fileService.deleteFile(name);
      this.send(res, 200, `Cat ${name} deleted.`);
    } catch (error) {
      next(error);
    }
  }
};
