import { isEmptyPlainObject, isPlainObject } from '../object-utils';

export const filterChangedFormFields = <T extends Record<string, any>>(
  dirtyFields: Partial<Record<keyof T, any>>,
  data: T
): Partial<Record<keyof T, any>> | undefined => {
  const keys = Object.keys(dirtyFields) as (keyof T)[];
  const filterData: Partial<Record<keyof T, any>> = {};

  if (isEmptyPlainObject(keys)) return;

  keys.forEach((key) => {
    if (Array.isArray(dirtyFields[key])) {
      filterData[key] = dirtyFields[key]
        .map((subdata, index) => {
          if (!subdata) return;
          if (subdata === true) return data[key][index];
          return filterChangedFormFields(subdata, data[key][index]);
        })
        .filter(Boolean);
      return;
    }

    if (isPlainObject(dirtyFields[key])) {
      const result = filterChangedFormFields(dirtyFields[key], data[key]);
      if (!result || isEmptyPlainObject(result)) return;
      filterData[key] = result;
      return;
    }

    if (dirtyFields[key] === true) {
      filterData[key] = data[key];
      return;
    }
  });

  return filterData;
};
