import multer from 'multer';
import fsp from 'fs/promises';
import { Request } from 'express';
import { ConfigService } from '../common/config.service';
import { validateOrReject, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CatCreateDTO } from '../cats/cats.dto';
import { HttpError } from '../error/httpError';

const config = ConfigService.getInstance();

export const storage: multer.DiskStorageOptions = {
  async destination(req, file, cb) {
    try {
      await fsp.access(config.get('UPLOAD_PATH'));
      cb(null, config.get('UPLOAD_PATH'));
    } catch (error) {
      await fsp.mkdir(config.get('UPLOAD_PATH'));
      cb(null, config.get('UPLOAD_PATH'));
    }
  },
  filename(req, file, cb) {
    cb(null, `${req.body.name}.${file.mimetype.split('/')[1]}`);
  }
};

export const fileFilter = async (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback) => {
  try {
    req.body.type = file.mimetype.split('/')[1];
    await validateOrReject(plainToClass(CatCreateDTO, req.body));

    await fsp.access(config.get('UPLOAD_PATH') + `/${req.body.name}.${req.body.type}`);
    throw new HttpError(422, `Cat with name ${req.body.name} exist`);
  } catch (error: any) {
    if (Array.isArray(error) && error[0] instanceof ValidationError)
      return cb(new HttpError(400, 'Cat validation error', error));
    else if (error.code === 'ENOENT')
      return cb(null, true);
    cb(error);
  }
};

