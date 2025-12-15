import { JwtPayload } from 'jsonwebtoken';
import { RequiredProp } from 'src/shared/types/utils/required.types';

export type JwtPayloadModel = RequiredProp<JwtPayload, 'sub'>;
