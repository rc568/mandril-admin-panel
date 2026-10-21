import type { Product } from '../interfaces/api';
import type { ProductMapped } from '../interfaces/ui';

export const mapProductToDisplay = (product: Product): ProductMapped => {
  const { productVariant, ...rest } = product;

  const mapped: ProductMapped = {
    ...rest,
    productVariant: productVariant.map((pv) => {
      const price = parseFloat(pv.price);
      const purchasePrice = parseFloat(pv.purchasePrice);

      const profitPercentage = purchasePrice === 0 ? '0' : ((price - purchasePrice) / purchasePrice).toString();
      const stockStatus =
        pv.availableQuantity <= 0 ? 'Sin Stock' : pv.availableQuantity <= 5 ? 'Bajo Stock' : 'En Stock';

      return {
        ...pv,
        profitPercentage,
        stockStatus
      };
    })
  };

  return mapped;
};
