import type { z } from '@/lib/zod';
import type { FieldErrors } from 'react-hook-form';
import type { createProductSchema } from '../../validators/product.validators';

export type CreateProductForm = z.infer<typeof createProductSchema>;
// CreateProductForm is the BaseProductSchema
export type BaseProductFields = Partial<Omit<CreateProductForm, 'variants'>>;
export type BaseVariantFields = Partial<{ variants: Partial<CreateProductForm['variants'][number]>[] }>;
export type BaseProduct = BaseProductFields & BaseVariantFields;
export type VariantFieldError = NonNullable<FieldErrors<CreateProductForm>['variants']>[number];
