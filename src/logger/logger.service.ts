import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const dirPath = path.join(__dirname, '../');

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logToFile(message: any, context?: string, stack?: string) {
    const logStream = fs.createWriteStream(`${dirPath}logs.txt`, {
      flags: 'a',
    });
    logStream.write(`${message} ${context} ${super.getTimestamp()} ${stack}\n`);
    logStream.end();
  }

  private logToErrorFile(message: any, stack?: string, context?: string) {
    const logStream = fs.createWriteStream(`${dirPath}error-logs.txt`, {
      encoding: 'utf-8',
      flags: 'a',
    });
    logStream.write(
      `[ERROR] ${message} ${context} ${super.getTimestamp()} ${stack}\n`,
    );
    logStream.end();
  }

  error(message: any, stack?: string, context?: string) {
    this.logToFile(message, context, stack);
    this.logToErrorFile(message, stack, context);
    super.error(message);
  }

  log(message: any, context?: string) {
    this.logToFile(message, context);
    super.log(message);
  }
}
