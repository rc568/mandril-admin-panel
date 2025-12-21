export interface Category {
  name: string;
  slug: string;
}

export interface Catalog {
  name: string;
  slug: string;
}

export interface Attribute {
  name: string;
  description: string | null;
}

export interface ProductVariant {
  id: number;
  code: string;
  price: string;
  purchasePrice: string;
  quantityInStock: number;
  isActive: boolean;
  images: Image[];
  variantAttributes: VariantAttribute[];
}

interface Image {
  id: string;
  imageUrl: string;
}

interface VariantAttribute {
  value: string;
  attribute: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  category: Category;
  catalog: Catalog;
  attributes: Attribute[];
  productVariant: ProductVariant[];
  createdBy: string;
}
