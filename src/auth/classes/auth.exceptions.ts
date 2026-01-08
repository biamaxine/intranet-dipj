import {
  __UnauthorizedException,
  ExceptionOptions,
} from 'src/shared/classes/exception';
import { typeOf } from 'src/shared/utils/string.utils';

export class AccessDeniedException extends __UnauthorizedException {
  constructor(message: string, opts?: ExceptionOptions);
  constructor(message: string, { messages, ...opts }: ExceptionOptions = {}) {
    super('Acesso negado', {
      ...opts,
      messages: [
        message,
        ...(messages
          ? typeOf(messages, 'string')
            ? [messages]
            : messages
          : []),
      ],
    });
  }
}

export class ExpiredTokenException extends AccessDeniedException {
  constructor(opts?: ExceptionOptions) {
    super('Token expirado', opts);
  }
}

export class DisabledTokenException extends AccessDeniedException {
  constructor(opts?: ExceptionOptions) {
    super('Token desabilitado', opts);
  }
}

export class InvalidTokenException extends AccessDeniedException {
  constructor(opts?: ExceptionOptions) {
    super('Token inválido', opts);
  }
}

export class UserNotAuthenticatedException extends AccessDeniedException {
  constructor(opts?: ExceptionOptions) {
    super('Usuário não autenticado ou inexistente', opts);
  }
}
