import { getCategories } from './category.api';
import type { Category } from './interfaces/category.interface';

export const getAllCategories = async (): Promise<Category[]> => {
  const data = await getCategories();
  return data.sort((a, b) => a.name.localeCompare(b.name));
};
