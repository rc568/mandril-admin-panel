import { isEmptyPlainObject, isPlainObject } from '../object-utils';

export const filterChangedFormFields = <T extends Record<string, any>>(
  dirtyFields: Partial<Record<keyof T, any>>,
  data: T
): Partial<Record<keyof T, any>> | undefined => {
  const filterData: Partial<Record<keyof T, any>> = {};

  for (const key in dirtyFields) {
    const dirtyValue = dirtyFields[key];
    const dataValue = data[key];

    if (Array.isArray(dirtyValue)) {
      if (dirtyValue.length === 0) continue;

      const filterArray = dirtyValue
        .map((subdata, index) => {
          if (!subdata) return;
          if (subdata === true) return dataValue[index];
          return filterChangedFormFields(subdata, dataValue[index]);
        })
        .filter(Boolean);

      if (filterArray.length === 0) continue;
      filterData[key] = filterArray;
      continue;
    }

    if (isPlainObject(dirtyValue)) {
      const result = filterChangedFormFields(dirtyValue, dataValue);
      if (!result || isEmptyPlainObject(result)) continue;
      filterData[key] = result;
      continue;
    }

    if (dirtyValue === true) {
      filterData[key] = dataValue;
    }
  }

  if (isEmptyPlainObject(filterData)) return;
  return filterData;
};

export const filterNullishFields = <T extends Record<string, any>>(
  data: T
): Partial<Record<keyof T, any>> | undefined => {
  const filterData: Partial<Record<keyof T, any>> = {};

  for (const key in data) {
    const value = data[key];

    if (Array.isArray(value)) {
      if (value.length === 0) continue;

      const filterArray = value
        .map((subdata: unknown) => {
          if (subdata === undefined || subdata === null) return;
          if (isPlainObject(subdata)) return filterNullishFields(subdata);
          return subdata;
        })
        .filter(Boolean);

      if (filterArray.length === 0) continue;
      filterData[key] = filterArray;
      continue;
    }

    if (isPlainObject(value)) {
      const result = filterNullishFields(value);
      if (!result || isEmptyPlainObject(result)) continue;
      filterData[key] = result;
      continue;
    }

    if (value !== undefined && value !== null) {
      filterData[key] = value;
    }
  }

  if (isEmptyPlainObject(filterData)) return;
  return filterData;
};
