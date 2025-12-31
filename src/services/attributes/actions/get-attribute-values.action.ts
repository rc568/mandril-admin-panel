import { getAttributeValues } from '../api/attribute-values.api';

export const getAttributeValuesAction = async (id: number) => {
  return await getAttributeValues(id);
};
