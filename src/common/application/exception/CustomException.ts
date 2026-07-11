import { AppException } from './AppException';

export default class CustomException extends AppException {
  public name: string;
  public details: Array<string> | undefined;
  public httpStatus: number;

  constructor(error: CustomExceptionInterface) {
    super(error.message, error.exception, error.code);
    this.name = 'CustomException';
    this.message = error.message;
    this.httpStatus = this.getHttpStatus(error.httpStatus);
    this.details = this.getDetails(error.details);
  }

  private getDetails(details: unknown): Array<string> {
    if (details) {
      return Array.isArray(details) ? details : [String(details)];
    }
    return [];
  }

  private getHttpStatus(httpStatus?: number) {
    return httpStatus ?? 500;
  }
}

interface CustomExceptionInterface {
  code: string;
  message: string;
  httpStatus: number;
  details?: Array<string> | string;
  exception?: Error;
}
