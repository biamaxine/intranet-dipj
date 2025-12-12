import { ApiProperty } from '@nestjs/swagger';
import * as pakage from '../package.json';

export class ApiMetadata {
  private static instance?: ApiMetadata;

  @ApiProperty() readonly TITLE: string = pakage.name.toUpperCase();
  @ApiProperty() readonly DESCRIPTION: string = pakage.description;
  @ApiProperty() readonly VERSION: string = pakage.version;
  @ApiProperty() readonly AUTHOR: string = pakage.author;
  @ApiProperty() readonly EMAIL: string = pakage.email;
  @ApiProperty() readonly WEBSITE: string = pakage.website;

  private constructor() {}

  static getInstance(): ApiMetadata {
    if (!ApiMetadata.instance) ApiMetadata.instance = new ApiMetadata();
    return ApiMetadata.instance;
  }
}
