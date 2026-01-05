import { Department } from 'generated/prisma/client';
import { DepartmentOrderByWithRelationInput } from 'generated/prisma/models';
import { PrismaPaginationModel } from 'src/shared/models/prisma/pagination.model';
import { OmitBySuffix } from 'src/shared/utils/types/omit.types';
import { PartialType } from 'src/shared/utils/types/partial.types';
import { PickOneOf } from 'src/shared/utils/types/pick.types';
import { Prettify } from 'src/shared/utils/types/prettify.type';

export type DepartmentCreate = PartialType<
  Omit<OmitBySuffix<Department, '_at'>, 'id' | 'is_active'>,
  null
>;

export type DepartmentIdentifier = PickOneOf<
  Department,
  'id' | 'name' | 'acronym' | 'manager_id'
>;

export type DepartmentFilters = Prettify<
  PrismaPaginationModel & {
    orderBy?:
      | DepartmentOrderByWithRelationInput
      | DepartmentOrderByWithRelationInput[];
  } & Partial<
      Pick<Department, 'name' | 'acronym' | 'email' | 'phone' | 'is_active'>
    >,
  DepartmentOrderByWithRelationInput
>;

export type DepartmentUpdate = Partial<
  Omit<OmitBySuffix<Department, '_at'>, 'id' | 'is_active'>
>;
