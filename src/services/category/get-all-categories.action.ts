import { categoryApi } from './category.api';
import type { Category } from './interfaces/category.interface';
import type { GetCategoriesApiResponse } from './interfaces/get-all-categories.interface';

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await categoryApi.get<GetCategoriesApiResponse>('/');
  return response.data.data.sort((a, b) => a.name.localeCompare(b.name));
};
