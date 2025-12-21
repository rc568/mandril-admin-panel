import axios from 'axios';
import { login } from '../api/auth.api';
import type { LoginBody } from '../interface/login.interface';

export const loginAction = async ({ password, userName }: LoginBody) => {
  try {
    const { data } = await login({
      userName: userName,
      password: password
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) throw error.response?.data;
    throw new Error('Error insesperado.');
  }
};
