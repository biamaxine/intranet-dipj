import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { isArrayOf } from '../utils/array.utils';
import { isNotEmpty, isPlainObject } from '../utils/object.utils';
import { toPascalCase, typeOf } from '../utils/string.utils';

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

    const errorName = `${toPascalCase(HttpStatus[status])}Exception`;

    const body: ExceptionResponse = {
      statusCode: status,
      error: errorName,
      message: exception.message,
      timestamp: new Date().toISOString(),
    };

    if (typeOf(exceptionResponse, 'string')) body.message = exceptionResponse;
    else if (isPlainObject(exceptionResponse)) {
      const { message, statusCode, error, ...data } =
        exceptionResponse as Record<string, any>;

      if (
        typeOf(message, 'string') ||
        (Array.isArray(message) && isArrayOf(message, v => typeOf(v, 'string')))
      )
        body.message = message;

      if (isNotEmpty(data)) body.data = data;
    }

    response.status(status).json(body);
  }
}
