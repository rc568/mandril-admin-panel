import { getAttributeById } from '../api';

export const getAttributesByIdAction = async (id: number) => {
  return await getAttributeById(id);
};
