import { LoggerService } from '@nestjs/common';

export class CustomLoggerSupport implements LoggerService {
  contextLog: string;
  contextRequest?: object;

  constructor(contextLog = '', contextRequest?: object) {
    if (!process.env.AWS_REQUEST_ID && contextRequest) {
      process.env.AWS_REQUEST_ID = (contextRequest as { awsRequestId?: string })?.awsRequestId;
    }
    this.contextLog = contextLog;
    this.contextRequest = contextRequest;
  }

  log(message: string | object, ...optionalParams: unknown[]) {
    process.stdout.write(this.formatLog('INFO', message, this.contextLog, this.contextRequest, ...optionalParams));
  }

  fatal(message: string | object, ...optionalParams: unknown[]) {
    process.stderr.write(this.formatLog('FATAL', message, this.contextLog, this.contextRequest, ...optionalParams));
  }

  error(message: string | object, ...optionalParams: unknown[]) {
    process.stderr.write(this.formatLog('ERROR', message, this.contextLog, this.contextRequest, ...optionalParams));
  }

  warn(message: string | object, ...optionalParams: unknown[]) {
    process.stdout.write(this.formatLog('WARN', message, this.contextLog, this.contextRequest, ...optionalParams));
  }

  debug(message: string | object, ...optionalParams: unknown[]) {
    process.stdout.write(this.formatLog('DEBUG', message, this.contextLog, this.contextRequest, ...optionalParams));
  }

  verbose(message: string | object, ...optionalParams: unknown[]) {
    process.stdout.write(this.formatLog('VERBOSE', message, this.contextLog, this.contextRequest, ...optionalParams));
  }

  formatLog(
    level: string,
    message: string | object,
    context?: string,
    contextRequest?: object,
    ...optionalParams: unknown[]
  ): string {
    const timestamp = new Date().toISOString();
    context = context ? `[${context}] ` : '';
    const contextRequestId =
      (contextRequest as { awsRequestId?: string; requestId?: string })?.awsRequestId ||
      (contextRequest as { requestId?: string })?.requestId ||
      process.env.AWS_REQUEST_ID;
    const requestIdPart = contextRequestId ? `${contextRequestId} ` : '';
    const traceLog = `${timestamp} ${requestIdPart}${level} - ${context}`;

    let formattedMessage = '';

    if (typeof message === 'string' && optionalParams.length === 1 && typeof optionalParams[0] === 'object') {
      try {
        formattedMessage = `${message} ${JSON.stringify(optionalParams[0])}`;
      } catch {
        formattedMessage = `${message} [Unserializable object]`;
      }
    } else if (typeof message === 'object') {
      formattedMessage = JSON.stringify(message, null, 2);
    } else {
      formattedMessage = String(message);
    }

    return `${process.env.IS_OFFLINE ? `${context}` : traceLog}${formattedMessage}\n`;
  }
}
