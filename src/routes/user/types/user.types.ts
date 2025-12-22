import { User } from 'generated/prisma/client';
import { UserOrderByWithRelationInput } from 'generated/prisma/models';
import { PrismaPaginationModel } from 'src/shared/models/prisma/pagination.model';
import { OmitBySuffix } from 'src/shared/types/utils/omit.types';
import { PartialType } from 'src/shared/types/utils/partial.types';
import { PickBySuffix, PickOneOf } from 'src/shared/types/utils/pick.types';
import { Prettify } from 'src/shared/types/utils/prettify.type';

export type UserCreate = Prettify<
  PartialType<OmitBySuffix<User, '_at' | 'is_active'>, null> & {
    is_manager?: boolean;
  }
>;

export type UserIdentifier = PickOneOf<User, 'id' | 'cpf' | 'email' | 'phone'>;

export type UserFilters = Prettify<
  PrismaPaginationModel & {
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
  } & Partial<
      Pick<
        User,
        'name' | 'cpf' | 'email' | 'phone' | 'is_active' | 'department_id'
      >
    >,
  UserOrderByWithRelationInput
>;

export type UserUpdate = Prettify<
  Partial<Omit<User, 'id' | 'is_active' | keyof PickBySuffix<User, '_at'>>> & {
    is_manager?: boolean;
  }
>;
