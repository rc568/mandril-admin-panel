import { getCategories } from '../api/category.api';
import type { Category } from '../interfaces/api';

export const getAllCategories = async (): Promise<Category[]> => {
  const data = await getCategories();
  return data.sort((a, b) => a.name.localeCompare(b.name));
};
