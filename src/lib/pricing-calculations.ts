export const productProfit = (price: number, purchasePrice: number): number => {
  if (!purchasePrice || purchasePrice === 0) return 0;
  return (price - purchasePrice) / purchasePrice;
};
