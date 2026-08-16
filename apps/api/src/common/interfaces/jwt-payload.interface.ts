import { Role } from '../../modules/users/enums/role';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}
