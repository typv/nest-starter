import { applyDecorators } from '@nestjs/common';
import { RoleBaseAccessControl } from '../decorators';
import { Role } from '../enums';

export function AccessControl(roles: Role[]) {
  const decorators = [RoleBaseAccessControl(...roles)];

  return applyDecorators(...decorators);
}
