import { baseApi } from '../../../lib/axios/api';
import type { AuthResponse, LoginBody, LogoutResponse } from '../interface/login.interface';

export const checkAuth = () => baseApi.get<AuthResponse>('auth/check-auth');
export const login = (body: LoginBody) => baseApi.post<AuthResponse>('/auth/login', body);
export const logout = () => baseApi.post<LogoutResponse>('/auth/token/logout');
export const refreshToken = () => baseApi.post('/auth/token/refresh');
