import { create } from 'zustand';
import { checkAuthAction } from '../actions/check-auth.action';
import { loginAction } from '../actions/login.action';
import { logoutAction } from '../actions/logout.action';
import type { LoginBody, LogoutResponse } from '../interface/login.interface';
import type { User } from '../interface/user.interface';

type AuthStatus = 'authenticated' | 'non-authenticated' | 'checking';

type AuthState = {
  user: User | null;
  authStatus: AuthStatus;
  isAdmin: () => boolean;
  checkAuthStatus: () => Promise<boolean>;
  login: (body: LoginBody) => Promise<boolean>;
  logout: () => Promise<LogoutResponse | undefined>;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  authStatus: 'checking',
  isAdmin: () => {
    const role = get().user?.role;
    return role === 'admin';
  },
  checkAuthStatus: async () => {
    try {
      const user = await checkAuthAction();
      set({ user: user, authStatus: 'authenticated' });
      return true;
    } catch (error) {
      set({ user: null, authStatus: 'non-authenticated' });
      return false;
    }
  },
  login: async ({ userName, password }) => {
    try {
      const data = await loginAction({
        userName,
        password
      });
      set({ user: data, authStatus: 'authenticated' });
      return true;
    } catch (error) {
      set({ user: null, authStatus: 'non-authenticated' });
      return false;
    }
  },
  logout: async () => {
    try {
      const data = await logoutAction();
      set({ user: null, authStatus: 'non-authenticated' });
      return data;
    } catch (error) {
      set({ user: null, authStatus: 'non-authenticated' });
    }
  }
}));
