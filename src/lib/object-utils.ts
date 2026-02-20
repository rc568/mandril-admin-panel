export const isPlainObject = (value: unknown): boolean => {
  return (
    typeof value === 'object' &&
    !Array.isArray(value) &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  );
};

export const isEmptyPlainObject = (obj: object): boolean => {
  return isPlainObject(obj) && Object.keys(obj).length === 0;
};
