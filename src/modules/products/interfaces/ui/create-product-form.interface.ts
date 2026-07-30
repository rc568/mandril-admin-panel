import type { z } from '@/lib/zod';
import type { baseProductSchema, createProductSchema } from '../../validators/product.validators';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type CreateProductForm = z.infer<typeof createProductSchema>;
export type BaseProductFields = DeepPartial<z.infer<typeof baseProductSchema>>;
