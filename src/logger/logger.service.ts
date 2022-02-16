/* eslint-disable no-use-before-define */
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'tslog';

//Singleton logger-service for all server
export class LoggerService {
  private static instance: LoggerService;
  private logger: Logger;

  private constructor() {
    this.logger = new Logger({
      displayInstanceName: false,
      displayLoggerName: false,
      displayFunctionName: false,
      displayFilePath: 'hidden',
      dateTimePattern: 'year-month-day hour:minute:second'
    });
  }

  public static getInstance() {
    if (!LoggerService.instance)
      LoggerService.instance = new LoggerService();

    return LoggerService.instance;
  }

  public log(...args: unknown[]) {
    this.logger.info(...args);
  }

  public error(...args: unknown[]) {
    this.logger.error(...args);
  }

  public warn(...args: unknown[]) {
    this.logger.warn(...args);
  }

  public requestLogger(req: Request, res: Response, next: NextFunction) {
    this.logger.debug(`[${req.method}] Request ${req.url}`);
    next();
  }
}
