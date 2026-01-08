import {
  __BadRequestException,
  __ConflictException,
  __NotFoundException,
  ExceptionOptions,
} from 'src/shared/classes/exception';

export const DEPARTMENT_CREATED_FAILURE =
  'Não foi possível cadastrar o departamento';
export const DEPARTMENT_UPDATED_FAILURE =
  'Não foi possível atualizar o departamento';
export const DEPARTMENT_DISABLED_FAILURE =
  'Não foi possível desabilitar o departamento';
export const DEPARTMENT_ENABLED_FAILURE =
  'Não foi possível habilitar o departamento';

// BAD REQUEST
export class NoProvidedDepartmentDataException extends __BadRequestException {
  constructor(opts?: ExceptionOptions) {
    super('Nenhum dado foi fornecido para atualização do departamento', opts);
  }
}

export class InactiveDepartmentException extends __BadRequestException {
  constructor(opts?: ExceptionOptions) {
    super('O departamento informado encontra-se inativo', opts);
  }
}

export class InactiveManagerException extends __BadRequestException {
  constructor(opts?: ExceptionOptions) {
    super('O usuário informado para gerência encontra-se inativo', opts);
  }
}

// NOT_FOUND
export class DepartmentNotFoundException extends __NotFoundException {
  constructor(opts?: ExceptionOptions) {
    super('O departamento solicitado não foi encontrado', opts);
  }
}

export class ManagerNotFoundException extends __NotFoundException {
  constructor(opts?: ExceptionOptions) {
    super('O usuário informado para gerência não foi encontrado', opts);
  }
}

// CONFLICT
export class DepartmentConflictException extends __ConflictException {
  constructor(opts?: ExceptionOptions) {
    super('Uma ou mais chaves exclusivas já foram cadastradas', opts);
  }
}
