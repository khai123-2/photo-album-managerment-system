import { UserStatus } from 'src/constants/user-status';

export class UpdateUserDto {
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  status?: UserStatus;
}
