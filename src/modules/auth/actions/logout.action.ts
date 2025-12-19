import axios from 'axios';
import { logout } from '../api/auth.api';

export const logoutAction = async () => {
  try {
    const { data } = await logout();
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) throw error.response?.data;
    throw new Error('Error insesperado.');
  }
};
