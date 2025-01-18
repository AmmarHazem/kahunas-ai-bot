import { UserRole } from './UserRole';

export interface RequestUser {
  id: string;
  email: string;
  role: UserRole;
}
