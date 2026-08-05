import type { z } from '@/lib/zod';
import type { FieldErrors } from 'react-hook-form';
import type { baseProductSchema, createProductSchema } from '../../validators/product.validators';

export type CreateProductForm = z.infer<typeof createProductSchema>;
export type BaseProductFields = Partial<z.infer<typeof baseProductSchema>>;
export type VariantFieldError = NonNullable<FieldErrors<CreateProductForm>['variants']>[number];
