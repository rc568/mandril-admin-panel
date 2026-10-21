export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Catalog {
  id: number;
  name: string;
  slug: string;
}

export interface Attribute {
  id: number;
  name: string;
  description: string | null;
}

export interface ProductVariant {
  id: number;
  code: string;
  price: string;
  purchasePrice: string;
  availableQuantity: number;
  warrantyMonths: number | null;
  lengthCm: string | null;
  widthCm: string | null;
  heightCm: string | null;
  weightGrams: string | null;
  packageLengthCm: string | null;
  packageWidthCm: string | null;
  packageHeightCm: string | null;
  stockAlertThreshold: number | null;
  offerPrice: string | null;
  offerStartsAt: string | null;
  offerEndsAt: string | null;
  isOfferActive: boolean;
  isActive: boolean;
  images: Image[];
  variantAttributes: VariantAttribute[];
}

interface Image {
  id: string;
  imageUrl: string;
  position: number;
  isPrimary: boolean;
}

interface VariantAttribute {
  value: string;
  valueId: number;
  attribute: string;
  attributeId: number;
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
