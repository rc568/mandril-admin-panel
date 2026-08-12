export const PRODUCT_ORDER_BY_OPTIONS = {
  name_asc: 'Nombre (A a Z)',
  name_desc: 'Nombre (Z a A)'
} as const;

export const PRODUCT_ORDER_BY_ARRAY = Object.keys(PRODUCT_ORDER_BY_OPTIONS);
export const PRODUCT_ORDER_BY_ENTRIES = Object.entries(PRODUCT_ORDER_BY_OPTIONS).map(([key, value]) => ({
  key,
  value
}));

export const SLUG_REGEX = /^[a-z0-9]{1}[a-z0-9]{2,255}$/;
