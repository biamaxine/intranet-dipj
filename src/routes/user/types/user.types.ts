import { User } from 'generated/prisma/client';
import { UserOrderByWithRelationInput } from 'generated/prisma/models';
import { PrismaPaginationModel } from 'src/shared/models/prisma/pagination.model';
import { OmitBySuffix, OmitType } from 'src/shared/utils/types/omit.types';
import { PartialType } from 'src/shared/utils/types/partial.types';
import { PickBySuffix, PickOneOf } from 'src/shared/utils/types/pick.types';
import { Prettify } from 'src/shared/utils/types/prettify.type';
import { RequiredType } from 'src/shared/utils/types/required.types';

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

export type UserEnable = OmitType<Pick<User, 'email' | 'phone'>, null>;
