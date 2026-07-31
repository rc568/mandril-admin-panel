import { getAttributeValues } from '../api';

export const getAttributeValuesAction = async (id: number) => {
  return await getAttributeValues(id);
};
