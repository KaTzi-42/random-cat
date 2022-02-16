import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';

export class ConfigService {
  private static config: DotenvParseOutput;

  private static _initialize() {
    const result: DotenvConfigOutput = config();
    if(result.error)
      
  }
}