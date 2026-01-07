import { User } from 'generated/prisma/client';
import { UserOrderByWithRelationInput } from 'generated/prisma/models';
import { PrismaPaginationModel } from 'src/shared/models/prisma/pagination.model';
import {
  OmitByPrefix,
  OmitBySuffix,
  OmitType,
} from 'src/shared/utils/types/omit.types';
import { PartialType } from 'src/shared/utils/types/partial.types';
import { PickOneOf } from 'src/shared/utils/types/pick.types';
import { Prettify } from 'src/shared/utils/types/prettify.type';

// export type UserCreate = Prettify<
//   PartialType<Omit<OmitBySuffix<User, '_at'>, 'id' | 'is_active'>, null> & {
//     is_manager?: boolean;
//   }
// >;
export type UserCreate = Prettify<
  PartialType<
    Omit<OmitBySuffix<OmitByPrefix<User, 'is_'>, '_at'>, 'id'>,
    null
  > & {
    is_manager?: boolean;
  }
>;

export type UserLogin = PickOneOf<OmitType<Pick<User, 'email' | 'cpf'>, null>>;

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
  Partial<Omit<OmitBySuffix<User, '_at'>, 'id' | 'is_active'>> & {
    is_manager?: boolean;
  }
>;

export type UserEnable = OmitType<Pick<User, 'email' | 'phone'>, null>;
