import { ApiProperty } from '@nestjs/swagger';

export class ApiMetadata {
  private static instance?: ApiMetadata;

  @ApiProperty() readonly TITLE: string = 'INTRANET DIPJ';
  @ApiProperty() readonly DESCRIPTION: string =
    'Plataforma web local de gestão centralizada de fluxo documental de inteligência do DIPJ, integrando repositório digital, motor de busca fulltext, controle auditável de prazos e análises estatísticas para otimizar a operacionalidade do departamento.';
  @ApiProperty() readonly VERSION: string = '1.0.0';
  @ApiProperty() readonly AUTHOR: string = 'Bianca Maxine Vieira';
  @ApiProperty() readonly EMAIL: string = 'bianca.maxine.vieira@gmail.com';
  @ApiProperty() readonly WEBSITE: string = 'https://biamaxine.github.io';

  private constructor() {}

  static getInstance(): ApiMetadata {
    if (!ApiMetadata.instance) ApiMetadata.instance = new ApiMetadata();
    return ApiMetadata.instance;
  }
}
