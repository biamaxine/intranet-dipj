import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiMetadata } from './api.metadata';

@Controller()
export class ApiController {
  constructor(private readonly service: ApiService) {}

  @Get()
  READ(): ApiMetadata {
    return this.service.read();
  }
}
