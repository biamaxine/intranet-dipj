export abstract class DepartmentErrors {
  // 400
  static readonly BAD_REQUEST = {
    INACTIVE: 'O departamento informado encontra-se inativo',
    MANAGER_INACTIVE: 'O usuário informado para gerência encontra-se inativo',
    NO_PROVIDED_DATA:
      'Nenhum dado foi fornecido para atualização do departamento',
  } as const;

  // 404
  static readonly NOT_FOUND = {
    DEPARTMENT: 'O departamento solicitado não foi encontrado',
    MANAGER: 'O usuário informado para gerência não foi encontrado',
  } as const;

  // 409
  static readonly CONFLICT = {
    DEPARTMENT:
      'Uma ou mais chaves exclusivas já foram cadastradas em outro departamento',
  } as const;

  // 500
  static readonly INTERNAL_SERVER_ERROR = {
    UNABLE_CREATE: 'Não foi possível cadastrar o departamento',
    UNABLE_UPDATE: 'Não foi possível atualizar o departamento',
    UNABLE_DELETE: 'Não foi possível excluir o departamento',
  } as const;
}
