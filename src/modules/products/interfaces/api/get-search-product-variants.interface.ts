import type { ProductVariant } from './product.interface';

interface ScrollPagination {
  limit: number;
  nextOffset: number;
}

export interface SearchProductVariant
  extends Pick<
    ProductVariant,
    | 'code'
    | 'availableQuantity'
    | 'purchasePrice'
    | 'price'
    | 'offerPrice'
    | 'offerEndsAt'
    | 'offerStartsAt'
    | 'isOfferActive'
    | 'variantAttributes'
  > {
  name: string;
  variantId: number;
}

export interface GetSearchProductVariantsApiResponse {
  pagination: ScrollPagination;
  products: SearchProductVariant[];
}

export interface GetSearchProductVariantsQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
}
