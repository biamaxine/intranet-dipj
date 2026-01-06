export abstract class UserErrors {
  // 400
  static readonly BAD_REQUEST = {
    INACTIVE: 'O usuário informado encontra-se inativo',
    NO_PROVIDED_DATA: 'Nenhum dado foi fornecido para atualização do usuário',
  } as const;

  // 401
  static readonly UNAUTHORIZED = {
    INVALID_SIGN_IN: 'Usuário ou senha inválidos',
  } as const;

  // 404
  static readonly NOT_FOUND = {
    USER: 'O usuário solicitado não foi encontrado',
  } as const;

  // 409
  static readonly CONFLICT = {
    USER: 'Uma ou mais chaves exclusivas já foram cadastradas em outro usuário',
  } as const;

  // 500
  static readonly INTERNAL_SERVER_ERROR = {
    UNABLE_CREATE: 'Não foi possível cadastrar o usuário',
    UNABLE_UPDATE: 'Não foi possível atualizar o usuário',
    UNABLE_DELETE: 'Não foi possível desabilitar o usuário',
    UNABLE_UNDELETE: 'Não foi possível habilitar o usuário',
  } as const;
}
