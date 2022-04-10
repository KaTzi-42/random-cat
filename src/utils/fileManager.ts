import fs from 'fs';
import fsp, { rename } from 'fs/promises';
import multer, { Options } from 'multer';
import path from 'path';
import { ConfigService } from '../common/config.service';

const config = ConfigService.getInstance();

interface MulterOptions extends Omit<Options, 'storage'> {
  storage?: multer.DiskStorageOptions;
}

export class FileManager {
  private _options: Options = {};
  private manager: multer.Multer;

  constructor(
    opt: MulterOptions
  ) {
    let diskStorage: multer.StorageEngine | undefined;
    if (opt.storage)
      diskStorage = multer.diskStorage(opt.storage);

    Object.assign(this._options, { ...opt, storage: diskStorage });
    this.manager = multer(this._options);
  }

  get options() {
    return this._options;
  }
  /**
   * Return a RequestHandler for multipart/form-data
   */
  uploadHandler(fileName: string) {
    return this.manager.single(fileName);
  }
  /**
   * Return a `ReadStream` with file in server.
   * @param fieldName Only name of the file like 'bigCat01.jpg'
   */
  readFile(fileName: string) {
    //const filePath = path.resolve(__dirname, `../../${config.get('UPLOAD_PATH')}/${fileName}`);
    return fs.createReadStream(`${config.get('UPLOAD_PATH')}/${fileName}`);
  }

  deleteFile(fileName: string) {
    fsp.unlink(`${config.get('UPLOAD_PATH')}/${fileName}`);
  }

  renameFile(fileName: string, newFileName: string) {

    rename(
      `${config.get('UPLOAD_PATH')}/${fileName}`,
      `${config.get('UPLOAD_PATH')}/${newFileName}`);
  }
}
