import { Department } from 'generated/prisma/client';
import { DepartmentOrderByWithRelationInput } from 'generated/prisma/models';
import { PrismaPaginationModel } from 'src/shared/models/prisma/pagination.model';
import { OmitBySuffix } from 'src/shared/types/utils/omit.types';
import { PartialType } from 'src/shared/types/utils/partial.types';
import { PickOneOf } from 'src/shared/types/utils/pick.types';
import { Prettify } from 'src/shared/types/utils/prettify.type';

export type DepartmentCreate = PartialType<
  OmitBySuffix<Department, '_at' | 'is_active'>,
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
    >
>;

export type DepartmentUpdate = Partial<
  Omit<Department, 'id' | 'created_at' | 'updated_at'>
>;
