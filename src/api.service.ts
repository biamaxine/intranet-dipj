import { Injectable } from '@nestjs/common';
import { ApiMetadata } from './api.metadata';

@Injectable()
export class ApiService {
  read(): ApiMetadata {
    return ApiMetadata.getInstance();
  }
}
