import { formatCurrency } from '@/lib/currency';
import type { Catalog } from '@/services/catalog/interfaces/catalog.interface';
import type { Category } from '@/services/category/interfaces/category.interface';
import type { LocalProductsFilters } from '../components/product-list-filters';

const getCategoryDisplayMap = (options: Category[] = []) => {
  if (!options) return {};
  return options.reduce(
    (acc, curr) => {
      acc[curr.id.toString()] = curr.name;
      return acc;
    },
    {} as Record<string, string>
  );
};

const getCatalogDisplayMap = (options: Catalog[] = []) => {
  if (!options) return {};
  return options.reduce(
    (acc, curr) => {
      acc[curr.id.toString()] = curr.name;
      return acc;
    },
    {} as Record<string, string>
  );
};

export const getFilterDisplayValue = (
  key: keyof LocalProductsFilters,
  value: string | Date | undefined,
  catalogs: Catalog[],
  categories: Category[]
): string => {
  if (!value) return '';

  const stringValue = String(value);
  const catalogMap = getCatalogDisplayMap(catalogs);
  const categoryMap = getCategoryDisplayMap(categories);

  switch (key) {
    case 'catalogId':
      return catalogMap[stringValue] || stringValue;

    case 'categoryId':
      return categoryMap[stringValue] || stringValue;

    case 'isActive':
      return stringValue === 'true' ? 'Activo' : stringValue === 'false' ? 'No activo' : '';

    case 'minPrice':
      return `Precio Mínimo: ${formatCurrency(parseFloat(stringValue))}`;

    case 'maxPrice':
      return `Precio Máximo: ${formatCurrency(parseFloat(stringValue))}`;

    default:
      return stringValue;
  }
};
