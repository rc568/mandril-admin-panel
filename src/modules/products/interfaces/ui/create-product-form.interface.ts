import type { z } from '@/lib/zod';
import type { baseProductSchema, createProductSchema, editProductSchema } from '../../validators/product.validators';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type CreateProductForm = z.infer<typeof createProductSchema>;
// export type BaseProductFields = z.infer<typeof baseProductSchema>;
export type BaseProductFields = DeepPartial<z.infer<typeof baseProductSchema>>;
export type EditProductForm = z.infer<typeof editProductSchema>;
