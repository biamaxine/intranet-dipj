import {
  __BadRequestException,
  __ConflictException,
  __ForbiddenException,
  __NotFoundException,
  __UnauthorizedException,
  ExceptionOptions,
} from 'src/shared/classes/exception';

export const USER_CREATED_FAILURE = 'Não foi possível cadastrar o usuário';
export const USER_UPDATED_FAILURE = 'Não foi possível atualizar o usuário';
export const USER_DISABLED_FAILURE = 'Não foi possível desabilitar o usuário';
export const USER_ENABLED_FAILURE = 'Não foi possível habilitar o usuário';

// BAD REQUEST
export class UserInactiveException extends __BadRequestException {
  constructor(opts?: ExceptionOptions) {
    super('O usuário informado encontra-se inativo', opts);
  }
}

export class NoProvidedUserDataException extends __BadRequestException {
  constructor(opts?: ExceptionOptions) {
    super('Nenhum dado foi fornecido para atualização do usuário', opts);
  }
}

// UNAUTHORIZED
export class InvalidLoginException extends __UnauthorizedException {
  constructor(opts?: ExceptionOptions) {
    super('Login ou senha inválidos', opts);
  }
}

// FORBIDDEN
export class RequiredManagerException extends __ForbiddenException {
  constructor(opts?: ExceptionOptions) {
    super('O usuário precisa ser gerente para realizar esta ação', opts);
  }
}

// NOT FOUND
export class UserNotFoundException extends __NotFoundException {
  constructor(opts?: ExceptionOptions) {
    super('O usuário solicitado não foi encontrado', opts);
  }
}

// CONFLICT
export class UserConflictException extends __ConflictException {
  constructor(opts?: ExceptionOptions) {
    super('Uma ou mais chaves exclusivas já foram cadastradas', opts);
  }
}

// INTERNAL SERVER ERROR
export class UserAlreadyHasActivityException extends __ForbiddenException {
  constructor(opts?: ExceptionOptions) {
    super('O usuário informado já possui atividades registradas', opts);
  }
}
