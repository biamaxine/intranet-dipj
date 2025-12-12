import { ApiMetadata } from './api.metadata';
import { SwaggerResponsesInput } from './shared/decorators/swagger/response.decorator';

export class ApiSwagger {
  static read: { responses: SwaggerResponsesInput<'OK'> } = {
    responses: {
      OK: {
        description: 'Dados da Api',
        type: ApiMetadata,
        example: ApiMetadata.getInstance(),
      },
    },
  };
}
