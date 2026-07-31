import type { Attribute, Value } from './attribute-value.interface';

export interface GetAttributeValuesApiResponse {
  attribute: Attribute;
  values: Value[];
}
