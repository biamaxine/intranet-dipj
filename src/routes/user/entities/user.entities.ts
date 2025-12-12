import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from './user.entity';

export class UserEntities {
  private static example?: UserEntities;

  @ApiProperty() total: number;
  @ApiProperty({ type: UserEntity, isArray: true }) users: UserEntity[];

  constructor(users: UserEntity[], total?: number) {
    Object.assign(this, { total: total || users.length, users });
  }

  static getExample(): UserEntities {
    if (!UserEntities.example)
      UserEntities.example = new UserEntities([UserEntity.getExample()]);

    return UserEntities.example;
  }
}
