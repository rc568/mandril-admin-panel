import type { User } from './user.interface';

export type AuthResponse = User;

export interface LoginBody {
  userName: string;
  password: string;
}
