import { JwtPayload } from 'jsonwebtoken';
import { RequiredProp } from 'src/shared/utils/types/required.types';

export type JwtPayloadModel = RequiredProp<JwtPayload, 'sub'>;
