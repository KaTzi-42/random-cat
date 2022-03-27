/* eslint-disable no-use-before-define */
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { LoggerService } from '../logger/logger.service';

export class ConfigService {
  private static instance: ConfigService;
  private config: DotenvParseOutput;
  private readonly logger: LoggerService = LoggerService.getInstance();

  private constructor() {
    const result: DotenvConfigOutput = config();
    if (result.error) {
      this.logger.error('Файл .env ну далось прочитать.');
    } else {
      this.logger.log('Конфигурация .env загружена');
      this.config = result.parsed!;
    }
  }

  public static getInstance() {
    if (!ConfigService.instance)
      ConfigService.instance = new ConfigService();

    return ConfigService.instance;
  }

  public get(key: string) {
    return this.config[key];
  }
}
