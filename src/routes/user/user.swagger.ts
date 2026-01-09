import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AccessDeniedException } from 'src/auth/classes/auth.exceptions';
import { SwaggerRoute } from 'src/shared/decorators/swagger/api.decorator';
import { SwaggerParamsInput } from 'src/shared/decorators/swagger/params.decorator';
import { SwaggerQueriesInput } from 'src/shared/decorators/swagger/queries.decorator';
import { SwaggerResponsesInput } from 'src/shared/decorators/swagger/response.decorator';

import { DepartmentEntity } from '../department/entities/department.entity';
import {
  InvalidLoginException,
  RequiredManagerException,
  USER_CREATED_FAILURE,
  USER_UPDATED_FAILURE,
  UserConflictException,
  UserNotFoundException,
} from './classes/user.exceptions';
import { UserEntities, UserEntity } from './entities/user.entity';
import { UserFilters } from './types/user.types';

const USER_ENTITY = UserEntity.getExample();
const USER_ENTITIES = UserEntities.getExample();
const DEPARTMENT_ENTITY = DepartmentEntity.getExample();

export abstract class UserSwagger {
  static readonly REGISTER: SwaggerRoute<{
    responses: SwaggerResponsesInput<
      | 'CREATED'
      | 'BAD_REQUEST'
      | 'UNAUTHORIZED'
      | 'FORBIDDEN'
      | 'CONFLICT'
      | 'INTERNAL_SERVER_ERROR'
    >;
  }> = {
    summary: 'CRIAR USUÁRIO',
    responses: {
      CREATED: {
        description: 'CREATED - Usuário criado com sucesso',
        type: UserEntity,
        example: USER_ENTITY,
      },
      BAD_REQUEST: {
        description: 'BAD REQUEST - Propriedades fornecidas são inválidas',
        example: new BadRequestException(['specific errors']),
      },
      UNAUTHORIZED: {
        description: 'UNAUTHORIZED - Usuário não autorizado',
        type: AccessDeniedException,
        example: new AccessDeniedException('specific error'),
      },
      FORBIDDEN: {
        description: 'FORBIDDEN - Rota restrita para gerentes de departamento',
        type: RequiredManagerException,
        example: new RequiredManagerException(),
      },
      CONFLICT: {
        description: 'CONFLICT - Alguma propriedade única já foi utilizada',
        type: UserConflictException,
        example: new UserConflictException({ keys: ['...violated keys'] }),
      },
      INTERNAL_SERVER_ERROR: {
        description: 'INTERNAL SERVER ERROR - Não foi possível criar o usuário',
        example: new InternalServerErrorException(USER_CREATED_FAILURE, {
          cause: new Error('original error'),
        }),
      },
    },
  };

  static readonly SIGN_IN: SwaggerRoute<{
    responses: SwaggerResponsesInput<'OK' | 'BAD_REQUEST' | 'UNAUTHORIZED'>;
  }> = {
    summary: 'AUTENTICAR USUÁRIO',
    responses: {
      OK: {
        description: 'OK - Usuário autenticado com sucesso',
        type: String,
        example: '[TOKEN]',
      },
      BAD_REQUEST: UserSwagger.REGISTER.responses.BAD_REQUEST,
      UNAUTHORIZED: {
        description: 'UNAUTHORIZED - Login inválido',
        type: InvalidLoginException,
        example: new InvalidLoginException(),
      },
    },
  };

  static readonly READ_ME: SwaggerRoute<{
    responses: SwaggerResponsesInput<'OK' | 'UNAUTHORIZED'>;
  }> = {
    summary: 'OBTER DADOS DO USUÁRIO AUTENTICADO',
    responses: {
      OK: {
        description: 'OK - Retorna os dados do usuário autenticado',
        type: UserEntity,
        example: USER_ENTITY,
      },
      UNAUTHORIZED: UserSwagger.REGISTER.responses.UNAUTHORIZED,
    },
  };

  static readonly READ_ONE: SwaggerRoute<{
    params: SwaggerParamsInput<'identifier'>;
    responses: SwaggerResponsesInput<
      'OK' | 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND'
    >;
  }> = {
    summary: 'OBTER DADOS DE UM USUÁRIO',
    params: {
      identifier: {
        description: 'ID, cpf, email ou telefone do usuário',
        type: String,
        examples: {
          id: {
            summary: 'ID do usuário',
            value: USER_ENTITY.id,
          },
          cpf: {
            summary: 'CPF do usuário',
            value: USER_ENTITY.cpf,
          },
          email: {
            summary: 'EMAIL do usuário',
            value: USER_ENTITY.email,
          },
          phone: {
            summary: 'Telefone do usuário',
            value: USER_ENTITY.phone,
          },
        },
      },
    },
    responses: {
      OK: {
        description: 'OK - Retorna os dados do usuário',
        type: UserEntity,
        example: USER_ENTITY,
      },
      BAD_REQUEST: UserSwagger.REGISTER.responses.BAD_REQUEST,
      UNAUTHORIZED: UserSwagger.REGISTER.responses.UNAUTHORIZED,
      FORBIDDEN: UserSwagger.REGISTER.responses.FORBIDDEN,
      NOT_FOUND: {
        description: 'NOT FOUND - Usuário não encontrado',
        type: UserNotFoundException,
        example: new UserNotFoundException(),
      },
    },
  };

  static readonly READ_MANY: SwaggerRoute<{
    queries: SwaggerQueriesInput<keyof UserFilters>;
    responses: SwaggerResponsesInput<
      'OK' | 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN'
    >;
  }> = {
    summary: 'OBTER DADOS DE VÁRIOS USUÁRIOS',
    queries: {
      department_id: {
        description: 'ID do departamento do usuário',
        type: String,
        example: DEPARTMENT_ENTITY.id,
      },
      page: {
        description: 'Número da página na paginação de usuários',
        type: Number,
        example: 1,
      },
      limit: {
        description: 'Quantidade de usuários por página',
        type: Number,
        example: 10,
      },
      name: {
        description: 'Filtro de usuários por nome',
        type: String,
        example: USER_ENTITY.name,
      },
      cpf: {
        description: 'Filtro de usuários por CPF',
        type: String,
        example: USER_ENTITY.cpf,
      },
      email: {
        description: 'Filtro de usuários por email',
        type: String,
        example: USER_ENTITY.email,
      },
      phone: {
        description: 'Filtro de usuários por telefone',
        type: String,
        example: USER_ENTITY.phone,
      },
      is_active: {
        description: 'Filtro de usuários por status',
        type: Boolean,
        example: USER_ENTITY.is_active,
      },
      orderBy: {
        description: [
          'Ordenar usuários por:',
          '* **Nome** (`name`)',
          '* **CPF** (`cpf`)',
          '* **Email** (`email`)',
          '* **Telefone** (`phone`)',
          '* **Data de Criação** (`created_at`)',
          '',
          'Use `"asc"` para crescente e `"desc"` para decrescente',
        ].join('\n'),
        type: String,
        default: '{ "created_at": "desc" }',
        examples: {
          name: {
            summary: 'Ordenar por nome crescente',
            value: '{ "name": "asc" }',
          },
          acronym: {
            summary: 'Ordenar por cpf decrescente',
            value: '{ "cpf": "desc" }',
          },
        },
      },
    },
    responses: {
      OK: {
        description: 'OK - Retorna os dados dos usuários',
        type: UserEntities,
        example: USER_ENTITIES,
      },
      BAD_REQUEST: UserSwagger.REGISTER.responses.BAD_REQUEST,
      UNAUTHORIZED: UserSwagger.REGISTER.responses.UNAUTHORIZED,
      FORBIDDEN: UserSwagger.REGISTER.responses.FORBIDDEN,
    },
  };

  static readonly UPDATE_ME: SwaggerRoute<{
    responses: SwaggerResponsesInput<
      | 'OK'
      | 'BAD_REQUEST'
      | 'UNAUTHORIZED'
      | 'CONFLICT'
      | 'INTERNAL_SERVER_ERROR'
    >;
  }> = {
    summary: 'ATUALIZAR DADOS DO USUÁRIO AUTENTICADO',
    responses: {
      OK: {
        description: 'OK - Usuário atualizado com sucesso',
        type: UserEntity,
        example: USER_ENTITY,
      },
      BAD_REQUEST: UserSwagger.REGISTER.responses.BAD_REQUEST,
      UNAUTHORIZED: UserSwagger.REGISTER.responses.UNAUTHORIZED,
      CONFLICT: UserSwagger.REGISTER.responses.CONFLICT,
      INTERNAL_SERVER_ERROR: {
        description:
          'INTERNAL SERVER ERROR - Não foi possível atualizar o usuário',
        example: new InternalServerErrorException(USER_UPDATED_FAILURE, {
          cause: new Error('original error'),
        }),
      },
    },
  };

  static readonly UPDATE_EMAIL: SwaggerRoute<{
    responses: SwaggerResponsesInput<
      | 'NO_CONTENT'
      | 'BAD_REQUEST'
      | 'UNAUTHORIZED'
      | 'CONFLICT'
      | 'INTERNAL_SERVER_ERROR'
    >;
  }> = {
    summary: 'ATUALIZAR EMAIL DO USUÁRIO AUTENTICADO',
    responses: {
      NO_CONTENT: {
        description: 'NO CONTENT - Email de confirmação foi enviado ao usuário',
        type: 'undefined',
      },
      BAD_REQUEST: UserSwagger.REGISTER.responses.BAD_REQUEST,
      UNAUTHORIZED: UserSwagger.REGISTER.responses.UNAUTHORIZED,
      CONFLICT: UserSwagger.REGISTER.responses.CONFLICT,
      INTERNAL_SERVER_ERROR:
        UserSwagger.UPDATE_ME.responses.INTERNAL_SERVER_ERROR,
    },
  };

  static readonly VERIFY_EMAIL: SwaggerRoute<{
    params: SwaggerParamsInput<'token'>;
    responses: SwaggerResponsesInput<
      | 'OK'
      | 'BAD_REQUEST'
      | 'UNAUTHORIZED'
      | 'CONFLICT'
      | 'INTERNAL_SERVER_ERROR'
    >;
  }> = {
    summary: 'VERIFICAR EMAIL DO USUÁRIO',
    params: {
      token: {
        description: 'Token enviado ao email do usuário',
        type: String,
      },
    },
    responses: {
      OK: {
        description: 'OK - Email verificado com sucesso',
        type: String,
        example: '[TOKEN]',
      },
      BAD_REQUEST: UserSwagger.REGISTER.responses.BAD_REQUEST,
      UNAUTHORIZED: UserSwagger.SIGN_IN.responses.UNAUTHORIZED,
      CONFLICT: UserSwagger.REGISTER.responses.CONFLICT,
      INTERNAL_SERVER_ERROR:
        UserSwagger.UPDATE_ME.responses.INTERNAL_SERVER_ERROR,
    },
  };

  static readonly UPDATE_PASSWORD: SwaggerRoute<{
    responses: SwaggerResponsesInput<
      'OK' | 'BAD_REQUEST' | 'UNAUTHORIZED' | 'INTERNAL_SERVER_ERROR'
    >;
  }> = {
    summary: 'ATUALIZAR SENHA DO USUÁRIO AUTENTICADO',
    responses: {
      OK: {
        description: 'OK - Senha atualizada com sucesso',
        type: 'undefined',
      },
      BAD_REQUEST: UserSwagger.REGISTER.responses.BAD_REQUEST,
      UNAUTHORIZED: UserSwagger.REGISTER.responses.UNAUTHORIZED,
      INTERNAL_SERVER_ERROR:
        UserSwagger.UPDATE_ME.responses.INTERNAL_SERVER_ERROR,
    },
  };

  static readonly REQUEST_PASSWORD_RECOVERY: SwaggerRoute<{
    responses: SwaggerResponsesInput<
      'NO_CONTENT' | 'BAD_REQUEST' | 'NOT_FOUND'
    >;
  }> = {
    summary: 'SOLICITAR RECUPERAÇÃO DE SENHA',
    responses: {
      NO_CONTENT: {
        description:
          'NO CONTENT - Email de recuperação de senha foi enviado ao usuário',
        type: 'undefined',
      },
      BAD_REQUEST: UserSwagger.REGISTER.responses.BAD_REQUEST,
      NOT_FOUND: UserSwagger.READ_ONE.responses.NOT_FOUND,
    },
  };

  static readonly RECOVERY_PASSWORD: SwaggerRoute<{
    responses: SwaggerResponsesInput<
      'NO_CONTENT' | 'BAD_REQUEST' | 'UNAUTHORIZED' | 'INTERNAL_SERVER_ERROR'
    >;
  }> = {
    summary: 'RECUPERAR SENHA',
    responses: {
      NO_CONTENT: {
        description: 'NO CONTENT - Senha alterado com sucesso',
        type: 'undefined',
      },
      BAD_REQUEST: UserSwagger.REGISTER.responses.BAD_REQUEST,
      UNAUTHORIZED: UserSwagger.REGISTER.responses.UNAUTHORIZED,
      INTERNAL_SERVER_ERROR: UserSwagger.UPDATE_ME.responses.BAD_REQUEST,
    },
  };

  static readonly UPDATE: SwaggerRoute<{
    params: SwaggerParamsInput<'identifier'>;
    responses: SwaggerResponsesInput<
      | 'OK'
      | 'BAD_REQUEST'
      | 'UNAUTHORIZED'
      | 'FORBIDDEN'
      | 'NOT_FOUND'
      | 'CONFLICT'
      | 'INTERNAL_SERVER_ERROR'
    >;
  }> = {
    summary: 'ATUALIZAR DADOS DE UM USUÁRIO',
    params: UserSwagger.READ_ONE.params,
    responses: {
      OK: UserSwagger.UPDATE_ME.responses.OK,
      BAD_REQUEST: UserSwagger.REGISTER.responses.BAD_REQUEST,
      UNAUTHORIZED: UserSwagger.REGISTER.responses.UNAUTHORIZED,
      FORBIDDEN: UserSwagger.REGISTER.responses.FORBIDDEN,
      NOT_FOUND: UserSwagger.READ_ONE.responses.NOT_FOUND,
      CONFLICT: UserSwagger.REGISTER.responses.CONFLICT,
      INTERNAL_SERVER_ERROR:
        UserSwagger.UPDATE_ME.responses.INTERNAL_SERVER_ERROR,
    },
  };

  static readonly DISABLE: SwaggerRoute<{
    params: SwaggerParamsInput<'identifier'>;
    responses: SwaggerResponsesInput<
      | 'OK'
      | 'BAD_REQUEST'
      | 'UNAUTHORIZED'
      | 'FORBIDDEN'
      | 'NOT_FOUND'
      | 'INTERNAL_SERVER_ERROR'
    >;
  }> = {
    summary: 'DESABILITAR UM USUÁRIO',
    params: UserSwagger.READ_ONE.params,
    responses: {
      OK: {
        ...UserSwagger.UPDATE.responses.OK,
        description: 'OK - Usuário desabilitado com sucesso',
      },
      BAD_REQUEST: UserSwagger.REGISTER.responses.BAD_REQUEST,
      UNAUTHORIZED: UserSwagger.REGISTER.responses.UNAUTHORIZED,
      FORBIDDEN: UserSwagger.REGISTER.responses.FORBIDDEN,
      NOT_FOUND: UserSwagger.READ_ONE.responses.NOT_FOUND,
      INTERNAL_SERVER_ERROR:
        UserSwagger.UPDATE_ME.responses.INTERNAL_SERVER_ERROR,
    },
  };

  static readonly ENABLE: SwaggerRoute<{
    params: SwaggerParamsInput<'identifier'>;
    responses: SwaggerResponsesInput<
      | 'OK'
      | 'BAD_REQUEST'
      | 'UNAUTHORIZED'
      | 'FORBIDDEN'
      | 'NOT_FOUND'
      | 'INTERNAL_SERVER_ERROR'
    >;
  }> = {
    summary: 'REABILITAR UM USUÁRIO',
    params: UserSwagger.READ_ONE.params,
    responses: {
      OK: {
        ...UserSwagger.UPDATE.responses.OK,
        description: 'OK - Usuário reabilitado com sucesso',
      },
      BAD_REQUEST: UserSwagger.REGISTER.responses.BAD_REQUEST,
      UNAUTHORIZED: UserSwagger.REGISTER.responses.UNAUTHORIZED,
      FORBIDDEN: UserSwagger.REGISTER.responses.FORBIDDEN,
      NOT_FOUND: UserSwagger.READ_ONE.responses.NOT_FOUND,
      INTERNAL_SERVER_ERROR:
        UserSwagger.UPDATE_ME.responses.INTERNAL_SERVER_ERROR,
    },
  };
}
