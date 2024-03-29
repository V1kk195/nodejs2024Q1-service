import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { LogLevel } from '@nestjs/common/services/logger.service';

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logStream = fs.createWriteStream(`./src/logs.log`, {
    encoding: 'utf-8',
    flags: 'w',
  });
  private errorLogStream = fs.createWriteStream(`./src/error-logs.log`, {
    encoding: 'utf-8',
    flags: 'w',
  });

  private logToFile(
    logLevel: LogLevel,
    message: any,
    context?: string,
    stack?: string,
  ) {
    this.logStream.write(
      `${super.getTimestamp()} [${logLevel.toUpperCase()}] ${message} ${context} ${stack}\n`,
    );
  }

  private logToErrorFile(message: any, stack?: string, context?: string) {
    this.errorLogStream.write(
      `${super.getTimestamp()} [ERROR] ${message} ${context} ${stack}\n`,
    );
  }

  error(message: any, stack?: string, context?: string) {
    this.logToFile('error', message, context, stack);
    this.logToErrorFile(message, stack, context);
    super.error(message);
  }

  log(message: any, context?: string) {
    this.logToFile('log', message, context);
    super.log(message);
  }

  warn(message: any, context?: string) {
    this.logToFile('warn', message, context);
    super.warn(message, context);
  }

  debug(message: any, context?: string) {
    this.logToFile('debug', message, context);
    super.debug(message, context);
  }

  verbose(message: any, context?: string) {
    this.logToFile('verbose', message, context);
    super.verbose(message, context);
  }
}
