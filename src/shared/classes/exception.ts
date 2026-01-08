import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';
import { typeOf } from '../utils/string.utils';

export interface ExceptionOptions extends HttpExceptionOptions {
  messages?: string | string[];
  [key: string]: any;
}

export abstract class Exception extends HttpException {
  constructor(status: HttpStatus, message: string, opts?: ExceptionOptions);
  constructor(
    status: HttpStatus,
    message: string,
    { messages, description, cause, ...rest }: ExceptionOptions = {},
  ) {
    super(
      {
        message: [
          message,
          ...(messages
            ? typeOf(messages, 'string')
              ? [messages]
              : messages
            : []),
        ],
        description,
        ...rest,
      },
      status,
      { cause, description },
    );

    if (HttpException.captureStackTrace)
      HttpException.captureStackTrace(this, this.constructor);
  }
}

// BAD_REQUEST
export class __BadRequestException extends Exception {
  constructor(message: string, opts?: ExceptionOptions) {
    super(HttpStatus.BAD_REQUEST, message, opts);
  }
}

// UNAUTHORIZED
export class __UnauthorizedException extends Exception {
  constructor(message: string, opts?: ExceptionOptions) {
    super(HttpStatus.UNAUTHORIZED, message, opts);
  }
}

// FORBIDDEN
export class __ForbiddenException extends Exception {
  constructor(message: string, opts?: ExceptionOptions) {
    super(HttpStatus.UNAUTHORIZED, message, opts);
  }
}

// NOT_FOUND
export class __NotFoundException extends Exception {
  constructor(message: string, opts?: ExceptionOptions) {
    super(HttpStatus.NOT_FOUND, message, opts);
  }
}

// CONFLICT
export class __ConflictException extends Exception {
  constructor(message: string, opts?: ExceptionOptions) {
    super(HttpStatus.CONFLICT, message, opts);
  }
}

// INTERNAL_SERVER_ERROR
export class __InternalServerErrorException extends Exception {
  constructor(message: string, opts?: ExceptionOptions) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message, opts);
  }
}
