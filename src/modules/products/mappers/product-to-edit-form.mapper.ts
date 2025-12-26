import type { ProductMapped } from '../interfaces/api/get-products-mapped.interface';
import type { ProductEditFormMapper } from '../interfaces/ui/product-edit-form.interface';

export const mapProductToEditForm = (product: ProductMapped): ProductEditFormMapper => {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description ?? undefined,
    catalogId: product.catalog.id,
    categoryId: product.category.id,
    variants: product.productVariant.map((pv) => {
      return {
        variantId: pv.id,
        isActive: pv.isActive,
        price: pv.price,
        purchasePrice: pv.purchasePrice,
        quantityInStock: pv.quantityInStock,
        attributes: pv.variantAttributes.map((va) => ({ attributeId: va.attributeId, valueId: va.valueId }))
      };
    })
  };
};
