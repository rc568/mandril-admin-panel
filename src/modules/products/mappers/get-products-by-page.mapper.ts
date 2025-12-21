import { formatCurrency, formatPercentage } from '@/lib/currency';
import type { ProductMapped } from '../interfaces/api/get-products-mapped.interface';
import type { Product } from '../interfaces/api/product.interface';

export const mapProductToDisplay = (product: Product): ProductMapped => {
  const { productVariant, ...rest } = product;

  const mapped: ProductMapped = {
    ...rest,
    productVariant: productVariant.map((pv) => {
      const price = parseFloat(pv.price);
      const purchasePrice = parseFloat(pv.purchasePrice);

      const formatPrice = formatCurrency(price);
      const formatPurchasePrice = formatCurrency(purchasePrice);
      const profitPercentage =
        purchasePrice === 0 ? formatPercentage(0) : formatPercentage((price - purchasePrice) / purchasePrice);
      const stockStatus = pv.quantityInStock <= 0 ? 'Sin Stock' : pv.quantityInStock <= 5 ? 'Bajo Stock' : 'En Stock';

      return {
        ...pv,
        price: formatPrice,
        purchasePrice: formatPurchasePrice,
        profitPercentage,
        stockStatus
      };
    })
  };

  return mapped;
};
