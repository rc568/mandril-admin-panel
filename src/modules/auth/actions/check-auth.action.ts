import { checkAuth } from '../api/auth.api';

export const checkAuthAction = async () => {
  const { data } = await checkAuth();
  return data;
};
