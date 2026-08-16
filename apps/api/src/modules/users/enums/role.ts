import { registerEnumType } from '@nestjs/graphql';
import { Role } from '../../../generated/prisma';

export { Role };

registerEnumType(Role, { name: 'Role' });
