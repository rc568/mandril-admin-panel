export const formatCurrency = (amount: number | string): string => {
  const value = typeof amount === 'string' ? (Number.isNaN(parseFloat(amount)) ? 0 : parseFloat(amount)) : amount;

  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(value);
};

export const formatPercentage = (amount: number | string): string => {
  const value = typeof amount === 'string' ? (Number.isNaN(parseFloat(amount)) ? 0 : parseFloat(amount)) : amount;

  return new Intl.NumberFormat('es-PE', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};
