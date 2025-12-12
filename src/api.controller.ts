import { Controller, Get } from '@nestjs/common';

import { ApiMetadata } from './api.metadata';
import { ApiService } from './api.service';
import { ApiSwagger } from './api.swagger';
import { SwaggerResponses } from './shared/decorators/swagger/response.decorator';

@Controller()
export class ApiController {
  constructor(private readonly service: ApiService) {}

  @Get()
  @SwaggerResponses(ApiSwagger.read.responses)
  READ(): ApiMetadata {
    return this.service.read();
  }
}
