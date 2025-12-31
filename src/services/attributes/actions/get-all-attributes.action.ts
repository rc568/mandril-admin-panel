import { getAttributes } from '../api/attribute.api';

export const getAllAttributesAction = async () => {
  const data = await getAttributes();
  return data.sort((a, b) => a.name.localeCompare(b.name));
};
