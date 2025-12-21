import axios from 'axios';
import { logout } from '../api/auth.api';

export const logoutAction = async (): Promise<void> => {
  try {
    await logout();
  } catch (error) {
    if (axios.isAxiosError(error)) throw error.response?.data;
    throw new Error('Error insesperado.');
  }
};
