import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SwaggerRoute } from 'src/shared/decorators/swagger/operation.decorator';
import { SwaggerParamsInput } from 'src/shared/decorators/swagger/params.decorator';
import { SwaggerQueriesInput } from 'src/shared/decorators/swagger/queries.decorator';
import { SwaggerResponsesInput } from 'src/shared/decorators/swagger/response.decorator';

import { DepartmentErrors } from './classes/department-errors';
import {
  DepartmentEntities,
  DepartmentEntity,
} from './entities/department.entity';
import { DepartmentFilters } from './types/department.types';

const DEPARTMENT_ENTITY = DepartmentEntity.getExample();
const DEPARTMENT_ENTITIES = DepartmentEntities.getExample();

export abstract class DepartmentSwagger {
  static readonly CREATE: SwaggerRoute<{
    responses: SwaggerResponsesInput<
      'CREATED' | 'BAD_REQUEST' | 'CONFLICT' | 'INTERNAL_SERVER_ERROR'
    >;
  }> = {
    summary: 'CRIAR DEPARTAMENTO',
    responses: {
      CREATED: {
        description: 'CREATED - Departamento criado com sucesso',
        type: DepartmentEntity,
        example: DEPARTMENT_ENTITY,
      },
      BAD_REQUEST: {
        description: 'BAD REQUEST - Propriedades fornecidas são inválidas',
        type: BadRequestException,
        example: new BadRequestException(['specific errors']),
      },
      CONFLICT: {
        description: 'CONFLICT - Alguma propriedade única já foi utilizada',
        type: ConflictException,
        example: new ConflictException(DepartmentErrors.CONFLICT.DEPARTMENT),
      },
      INTERNAL_SERVER_ERROR: {
        description:
          'INTERNAL SERVER ERROR - Não foi possível criar o departamento',
        type: ConflictException,
        example: new ConflictException(
          DepartmentErrors.INTERNAL_SERVER_ERROR.UNABLE_CREATE,
          { cause: new Error('original error') },
        ),
      },
    },
  };

  static readonly READ_ONE_BY_MANAGER: SwaggerRoute<{
    params: SwaggerParamsInput<'manager_id'>;
    responses: SwaggerResponsesInput<'OK' | 'BAD_REQUEST' | 'NOT_FOUND'>;
  }> = {
    summary: 'BUSCAR DEPARTAMENTO POR ID DE GERENTE',
    params: {
      manager_id: {
        description: 'ID do gerente do departamento',
        type: String,
        example: crypto.randomUUID(),
      },
    },
    responses: {
      OK: {
        description: 'OK - Departamento encontrado',
        type: DepartmentEntity,
        example: DEPARTMENT_ENTITY,
      },
      BAD_REQUEST: {
        description: 'BAD REQUEST - ID de gerente fornecido é inválido',
        type: BadRequestException,
        example: new BadRequestException(['specific errors']),
      },
      NOT_FOUND: {
        description: 'NOT FOUND - Departamento não encontrado',
        type: NotFoundException,
        example: new NotFoundException(DepartmentErrors.NOT_FOUND.MANAGER),
      },
    },
  };

  static readonly READ_ONE_BY_ACRONYM: SwaggerRoute<{
    params: SwaggerParamsInput<'acronym'>;
    responses: SwaggerResponsesInput<'OK' | 'BAD_REQUEST' | 'NOT_FOUND'>;
  }> = {
    summary: 'BUSCAR DEPARTAMENTO POR SIGLA',
    params: {
      acronym: {
        description: 'Sigla do departamento',
        type: String,
        example: 'DIPJ/SA',
      },
    },
    responses: {
      OK: {
        description: 'OK - Departamento encontrado',
        type: DepartmentEntity,
        example: DEPARTMENT_ENTITY,
      },
      BAD_REQUEST: {
        description: 'BAD REQUEST - Sigla fornecida é inválida',
        type: BadRequestException,
        example: new BadRequestException(['specific errors']),
      },
      NOT_FOUND: {
        description: 'NOT FOUND - Departamento não encontrado',
        type: NotFoundException,
        example: new NotFoundException(DepartmentErrors.NOT_FOUND.DEPARTMENT),
      },
    },
  };

  static readonly READ_ONE: SwaggerRoute<{
    params: SwaggerParamsInput<'identifier'>;
    responses: SwaggerResponsesInput<'OK' | 'BAD_REQUEST' | 'NOT_FOUND'>;
  }> = {
    summary: 'BUSCAR DEPARTAMENTO POR NOME OU ID',
    params: {
      identifier: {
        description: 'Nome ou ID do departamento',
        type: String,
        examples: {
          name: { summary: 'Nome do departamento', value: 'ANÁLISE' },
          id: { summary: 'ID do departamento', value: DEPARTMENT_ENTITY.id },
        },
      },
    },
    responses: {
      OK: {
        description: 'OK - Departamento encontrado',
        type: DepartmentEntity,
        example: DEPARTMENT_ENTITY,
      },
      BAD_REQUEST: {
        description: 'BAD REQUEST - Nome ou ID fornecidos são inválidos',
        type: BadRequestException,
        example: new BadRequestException(['specific errors']),
      },
      NOT_FOUND: DepartmentSwagger.READ_ONE_BY_ACRONYM.responses.NOT_FOUND,
    },
  };

  static readonly READ_MANY: SwaggerRoute<{
    queries: SwaggerQueriesInput<keyof DepartmentFilters>;
    responses: SwaggerResponsesInput<'OK' | 'BAD_REQUEST'>;
  }> = {
    summary: 'BUSCAR DEPARTAMENTOS',
    queries: {
      page: {
        description: 'Número da Página na paginação de departamentos',
        type: Number,
        default: 1,
      },
      limit: {
        description: 'Quantidade de departamentos por página',
        type: Number,
        default: 10,
      },
      name: {
        description: 'Filtrar departamentos por nome',
        type: String,
        maxLength: 60,
      },
      acronym: {
        description: 'Filtrar departamentos por sigla.',
        type: String,
        maxLength: 30,
      },
      email: {
        description: 'Filtrar departamentos por email',
        type: String,
        maxLength: 255,
      },
      phone: {
        description: 'Filtrar departamentos por telefone (string numérica)',
        type: String,
        maxLength: 11,
      },
      is_active: {
        description: 'Filtrar departamentos por status',
        type: Boolean,
      },
      orderBy: {
        description: [
          'Ordenar departamentos por:',
          '* **Nome** (`name`)',
          '* **Sigla** (`acronym`)',
          '* **Email** (`email`)',
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
            summary: 'Ordenar por sigla decrescente',
            value: '{ "acronym": "desc" }',
          },
        },
      },
    },
    responses: {
      OK: {
        description: 'OK - Departamentos encontrados',
        type: DepartmentEntities,
        example: DEPARTMENT_ENTITIES,
      },
      BAD_REQUEST: {
        description: 'BAD REQUEST - Filtros de busca fornecidos são inválidos',
        type: BadRequestException,
        example: new BadRequestException(['specific errors']),
      },
    },
  };

  static readonly UPDATE: SwaggerRoute<{
    params: SwaggerParamsInput<'identifier'>;
    responses: SwaggerResponsesInput<
      'OK' | 'BAD_REQUEST' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_SERVER_ERROR'
    >;
  }> = {
    summary: 'ATUALIZAR DEPARTAMENTO',
    params: DepartmentSwagger.READ_ONE.params,
    responses: {
      OK: {
        description: 'OK - Departamento atualizado com sucesso',
        type: DepartmentEntity,
        example: DEPARTMENT_ENTITY,
      },
      BAD_REQUEST: {
        description: 'BAD REQUEST',
        type: BadRequestException,
        examples: {
          identifier: {
            summary: 'Nome ou ID fornecidos são inválidos',
            value: new BadRequestException(['specifc errors']),
          },
          no_data_provided: {
            summary: 'Nenhum Dado foi fornecido para atualização',
            value: new BadRequestException(
              DepartmentErrors.BAD_REQUEST.NO_PROVIDED_DATA,
            ),
          },
          invalid_provided_data: {
            summary: 'Dados fornecidos para atualização são inválidos',
            value: new BadRequestException(['specific errors']),
          },
          inactive_manager: {
            summary: 'Usuário escolhido para gerente encontra-se inativo',
            value: new BadRequestException(
              DepartmentErrors.BAD_REQUEST.MANAGER_INACTIVE,
            ),
          },
        },
      },
      NOT_FOUND: {
        description: 'NOT FOUND - Departamento ou Gerente não encontrados',
        type: NotFoundException,
        examples: {
          department: {
            summary: 'Departamento não encontrado',
            value: new NotFoundException(DepartmentErrors.NOT_FOUND.DEPARTMENT),
          },
          manager: {
            summary: 'Gerente não encontrado',
            value: new NotFoundException(DepartmentErrors.NOT_FOUND.MANAGER),
          },
        },
      },
      CONFLICT: DepartmentSwagger.CREATE.responses.CONFLICT,
      INTERNAL_SERVER_ERROR: {
        description:
          'INTERNAL SERVER ERROR - Não foi possível atualizar o departamento',
        type: InternalServerErrorException,
        example: new InternalServerErrorException(
          DepartmentErrors.INTERNAL_SERVER_ERROR.UNABLE_UPDATE,
          { cause: new Error('original error') },
        ),
      },
    },
  };

  static readonly DISABLE: SwaggerRoute<{
    params: SwaggerParamsInput<'identifier'>;
    responses: SwaggerResponsesInput<
      'OK' | 'NOT_FOUND' | 'INTERNAL_SERVER_ERROR'
    >;
  }> = {
    summary: 'DESABILITAR DEPARTAMENTO',
    params: DepartmentSwagger.READ_ONE.params,
    responses: {
      OK: {
        description: 'OK - Departamento desabilitado com sucesso',
        type: DepartmentEntity,
        example: DEPARTMENT_ENTITY,
      },
      NOT_FOUND: DepartmentSwagger.READ_ONE.responses.NOT_FOUND,
      INTERNAL_SERVER_ERROR: {
        description:
          'INTERNAL SERVER ERROR - Não foi possivel desabilitar o departamento',
        type: InternalServerErrorException,
        example: new InternalServerErrorException(
          DepartmentErrors.INTERNAL_SERVER_ERROR.UNABLE_DELETE,
          { cause: new Error('original error') },
        ),
      },
    },
  };

  static readonly ENABLE: SwaggerRoute<{
    params: SwaggerParamsInput<'identifier'>;
    responses: SwaggerResponsesInput<
      'OK' | 'NOT_FOUND' | 'INTERNAL_SERVER_ERROR'
    >;
  }> = {
    summary: 'HABILITAR DEPARTAMENTO',
    params: DepartmentSwagger.READ_ONE.params,
    responses: {
      OK: {
        description: 'OK - Departamento habilitado com sucesso',
        type: DepartmentEntity,
        example: DEPARTMENT_ENTITY,
      },
      NOT_FOUND: DepartmentSwagger.READ_ONE.responses.NOT_FOUND,
      INTERNAL_SERVER_ERROR: {
        description:
          'INTERNAL SERVER ERROR - Não foi possivel habilitar o departamento',
        type: InternalServerErrorException,
        example: new InternalServerErrorException(
          DepartmentErrors.INTERNAL_SERVER_ERROR.UNABLE_UNDELETE,
          { cause: new Error('original error') },
        ),
      },
    },
  };
}
