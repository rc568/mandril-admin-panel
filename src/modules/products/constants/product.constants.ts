export const PRODUCT_ORDER_BY_OPTIONS = {
  name_asc: 'Nombre (A a Z)',
  name_desc: 'Nombre (Z a A)'
} as const;

export const PRODUCT_ORDER_BY_ARRAY = Object.keys(PRODUCT_ORDER_BY_OPTIONS);
export const PRODUCT_ORDER_BY_ENTRIES = Object.entries(PRODUCT_ORDER_BY_OPTIONS).map(([key, value]) => ({
  key,
  value
}));
