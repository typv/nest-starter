import { JwtTokenType, Role } from '../enums';

export interface TokenPayload {
  id: string;
  email: string;
  jti: string;
  role?: Role;
  type: JwtTokenType;
}

export interface UserRequestPayload {
  id: string;
  jti: string;
  email: string;
  role?: Role;
  emailVerified?: boolean;
}
