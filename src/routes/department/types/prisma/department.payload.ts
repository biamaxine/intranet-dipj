export const PrismaDepartmentPayload = {
  include: {
    manager: { select: { cpf: true, name: true, email: true, phone: true } },
  },
} as const;

export type PrismaDepartmentPayload = typeof PrismaDepartmentPayload;
