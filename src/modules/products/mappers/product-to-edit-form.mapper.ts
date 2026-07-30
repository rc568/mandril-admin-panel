import type { EditProductForm, ProductMapped } from '../interfaces/ui';

export const mapProductToEditForm = (product: ProductMapped): EditProductForm => {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description ?? undefined,
    catalogId: product.catalog.id,
    categoryId: product.category.id,
    attributesId: product.attributes.map((attr) => ({ attributeId: attr.id })),
    variants: product.productVariant.map((pv) => {
      return {
        variantId: pv.id,
        isActive: pv.isActive,
        price: parseFloat(pv.price),
        purchasePrice: parseFloat(pv.purchasePrice),
        quantityInStock: pv.quantityInStock,
        attributes: pv.variantAttributes.map((va) => ({ attributeId: va.attributeId, valueId: va.valueId }))
      };
    })
  };
};
