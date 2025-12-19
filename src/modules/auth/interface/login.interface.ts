import type { User } from './user.interface';

export interface AuthResponse {
  data: User;
}

export interface LoginBody {
  userName: string;
  password: string;
}

export interface LogoutResponse {
  message: string;
}
