import { ApiProperty } from '@nestjs/swagger';
import { Program } from 'generated/prisma/client';

export class ProgramEntity implements Program {
  private static example?: ProgramEntity;

  @ApiProperty() id: string;

  @ApiProperty() name: string;
  @ApiProperty({ required: false, type: String }) description: string | null;
  @ApiProperty() link: string;

  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;

  constructor(props: Program) {
    Object.assign(this, props);
  }

  static getExample(): ProgramEntity {
    if (!ProgramEntity.example) {
      ProgramEntity.example = new ProgramEntity({
        id: crypto.randomUUID(),
        name: 'Programa Exemplo',
        description: null,
        link: 'https://example.com',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    return ProgramEntity.example;
  }
}
