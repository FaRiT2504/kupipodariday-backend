import { User } from 'src/users/entities/user.entity';

export interface TUser extends Request {
  user: User;
}
