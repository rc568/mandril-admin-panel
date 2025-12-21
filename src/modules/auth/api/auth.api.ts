import { baseApi } from '../../../lib/axios/api';
import type { AuthResponse, LoginBody } from '../interface/login.interface';

export const checkAuth = () => baseApi.get<AuthResponse>('auth/check-auth');
export const login = (body: LoginBody) => baseApi.post<AuthResponse>('/auth/login', body);
export const logout = () => baseApi.post<void>('/auth/token/logout');
export const refreshToken = () => baseApi.post<void>('/auth/token/refresh');
