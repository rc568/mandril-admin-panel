import { getAttributeById } from '../api/attribute.api';

export const getAttributesByIdAction = async (id: number) => {
  return await getAttributeById(id);
};
