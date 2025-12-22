export const PrismaUserManagementPayload = {
  omit: { manager_id: true },
} as const;

export type PrismaUserManagementPayload = typeof PrismaUserManagementPayload;

export const PrismaUserPayload = {
  include: { management: PrismaUserManagementPayload },
  omit: { password: true },
} as const;

export type PrismaUserPayload = typeof PrismaUserPayload;

export const PrismaUserSignInPayload = {
  select: { id: true, password: true },
} as const;

export type PrismaUserSignInPayload = typeof PrismaUserSignInPayload;
