import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isEmail, isUUID } from 'class-validator';
import { IS_PHONE_REGEX } from 'src/shared/decorators/class-validator.decorators';
import { isCPF } from 'src/shared/utils/string.utils';

import { UserIdentifier } from '../types/user.types';

@Injectable()
export class UserIdentifierPipe implements PipeTransform {
  transform(value: string): UserIdentifier {
    if (isUUID(value)) return { id: value };
    if (isCPF(value)) return { cpf: value };
    if (isEmail(value)) return { email: value };
    if (IS_PHONE_REGEX.test(value)) return { phone: value };

    throw new BadRequestException('Indenficador de usuário inválido');
  }
}
