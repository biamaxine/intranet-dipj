import { ApiProperty } from '@nestjs/swagger';

import { ProgramEntity } from './program.entity';

export class ProgramEntities {
  private static example?: ProgramEntities;

  @ApiProperty() total: number;
  @ApiProperty({ type: ProgramEntity, isArray: true })
  programs: ProgramEntity[];

  constructor(programs: ProgramEntity[], total?: number) {
    Object.assign(this, { total: total || programs.length, programs });
  }

  static getExample(): ProgramEntities {
    if (!ProgramEntities.example) {
      ProgramEntities.example = new ProgramEntities([
        ProgramEntity.getExample(),
      ]);
    }
    return ProgramEntities.example;
  }
}
