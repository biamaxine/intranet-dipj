import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { __Array } from '../classes/utils/array';
import { __Object } from '../classes/utils/object';
import { __String } from '../classes/utils/string';

export interface ExceptionResponse {
  statusCode: HttpStatus;
  error: string;
  message: string | string[];
  timestamp: string;
  data?: Record<string, any>;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorName = `${__String.toPascalCase(HttpStatus[status])}Exception`;

    const body: ExceptionResponse = {
      statusCode: status,
      error: errorName,
      message: exception.message,
      timestamp: new Date().toISOString(),
    };

    if (typeof exceptionResponse === 'string') body.message = exceptionResponse;
    else if (__Object.isObject(exceptionResponse)) {
      const { message, statusCode, error, ...data } =
        exceptionResponse as Record<string, any>;

      if (
        typeof message === 'string' ||
        (Array.isArray(message) &&
          __Array.isArrayOf(message, v => typeof v === 'string'))
      )
        body.message = message;

      if (__Object.isNotEmpty(data)) body.data = data;
    }

    response.status(status).json(body);
  }
}
