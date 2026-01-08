import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isObject, isUUID } from 'class-validator';
import { isPlainObject } from 'src/shared/utils/object.utils';
import { clearCPF, isLiteral, typeOf } from 'src/shared/utils/string.utils';

import { UserFilters } from '../types/user.types';

const IS_INTEGER_REGEX = /^[1-9][0-9]*$/;
const IS_NUMBER_STRING_REGEX = /^\d+$/;

@Injectable()
export class UserFiltersPipe implements PipeTransform {
  transform(value: any): UserFilters {
    if (!value) return {};
    if (!isObject(value))
      throw new BadRequestException(
        'Filtros inválidos para busca de departamento',
      );

    const {
      page,
      limit,
      department_id,
      name,
      cpf,
      email,
      phone,
      is_active,
      orderBy,
    } = value as Record<keyof UserFilters, unknown>;

    const filters: UserFilters = {};
    const errors: string[] = [];

    if (page) {
      if (!typeOf(page, 'string') || !IS_INTEGER_REGEX.test(page))
        errors.push('Página deve ser um número inteiro maior que 0');
      else filters.page = parseInt(page);
    }

    if (limit) {
      if (!typeOf(limit, 'string') || !IS_INTEGER_REGEX.test(limit))
        errors.push('Limite deve ser um número inteiro maior que 0');
      else filters.limit = parseInt(limit);
    }

    if (department_id) {
      if (!typeOf(department_id, 'string') || !isUUID(department_id))
        errors.push('ID de departamento deve ser um UUID válido');
      else filters.department_id = department_id;
    }

    if (name) {
      if (!typeOf(name, 'string') || name.length > 60)
        errors.push('Nome deve ser uma string com no máximo 60 caracteres');
      else filters.name = name.toUpperCase();
    }

    if (cpf) {
      if (!typeOf(cpf, 'string') || clearCPF(cpf).length > 11)
        errors.push(
          'O filtro por cpf deve conter pelo menos parte de um cpf válido (ex.: "1234", "345.678", "678-90", "1234567890", "123.456.678-90")',
        );
      else filters.cpf = clearCPF(cpf);
    }

    if (email) {
      if (!typeOf(email, 'string') || email.length > 255)
        errors.push('Email deve ser uma string com no máximo 255 caracteres');
      else filters.email = email;
    }

    if (phone) {
      if (
        !typeOf(phone, 'string') ||
        !IS_NUMBER_STRING_REGEX.test(phone) ||
        phone.length > 11
      )
        errors.push(
          'Telefone deve ser uma string numérica com no máximo 11 caracteres',
        );
      else filters.phone = phone;
    }

    if (is_active) {
      if (
        !typeOf(is_active, 'string') ||
        !isLiteral(is_active, 'true', 'false')
      )
        errors.push('Status deve ser um booleano');
      else filters.is_active = is_active === 'true';
    }

    if (orderBy) {
      try {
        if (!typeOf(orderBy, 'string')) throw new Error();

        const json = JSON.parse(orderBy);
        if (!isPlainObject(json)) throw new Error();

        const result: Record<string, 'asc' | 'desc'> = {};
        const ordenables = ['name', 'cpf', 'email', 'phone', 'created_at'];
        for (const ordenable of ordenables) {
          const order = json[ordenable];
          if (!order) continue;
          if (!typeOf(order, 'string') || !isLiteral(order, 'asc', 'desc'))
            throw new Error();
          result[ordenable] = order;
        }

        filters.orderBy = result;
      } catch {
        errors.push('Ordenação deve ser um objeto JSON válido');
      }
    }

    if (errors.length > 0) throw new BadRequestException(errors);

    return filters;
  }
}
