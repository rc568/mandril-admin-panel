import { z } from '@/lib/zod';
import {
  baseTextSchema,
  integerId,
  integerNonNegativeNumber,
  positiveNumber,
  regexSchema
} from '@/validators/primitives';
import { SLUG_REGEX } from '../constants/product.constants';
import { messages } from '../constants/products.messages';

const productAttributeSchema = z.array(
  z.object({
    attributeId: integerId
  })
);

const variantAttributeValueMapSchema = z.array(
  z.object({
    attributeId: integerId,
    valueId: integerId
  })
);

export const productVariantSchema = z.object({
  price: positiveNumber,
  purchasePrice: positiveNumber,
  quantityInStock: integerNonNegativeNumber,
  attributes: variantAttributeValueMapSchema.optional()
});

export const baseProductSchema = z.object({
  name: baseTextSchema(3, 255),
  slug: regexSchema(SLUG_REGEX, messages.PRODUCT_SLUG),
  description: baseTextSchema(1).optional(),
  categoryId: integerId,
  catalogId: integerId,
  attributesId: productAttributeSchema.optional()
});

export const createProductSchema = baseProductSchema.extend({
  variants: z.array(productVariantSchema).nonempty()
});

export const editProductSchema = baseProductSchema
  .extend({
    // isActive: z.boolean().optional(),

    variants: z
      .array(
        productVariantSchema.extend({
          variantId: integerId.optional(),
          isActive: z.boolean().optional()
        })
      )
      .optional()
  })
  .partial()
  .check((ctx) => {
    if (ctx.value.variants && ctx.value.variants.length > 0) {
      const uniqueVariants = new Set<number>();

      for (const variant of ctx.value.variants) {
        if (variant.variantId !== undefined) {
          uniqueVariants.add(variant.variantId);
        }
        if (variant.attributes) {
          const uniqueAttribues = new Set(variant.attributes.map((attr) => attr.attributeId));

          if (variant.attributes.length !== uniqueAttribues.size) {
            ctx.issues.push({
              code: 'custom',
              input: ctx.value,
              message: messages.DUPLICATED_VARIANT_ATTRIBUTES,
              path: ['variants', 'attributes']
            });
          }
        }
      }

      const existingVariantsSize = ctx.value.variants.filter((v) => v.variantId !== undefined).length;

      if (existingVariantsSize !== uniqueVariants.size) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          message: messages.DUPLICATED_VARIANTS,
          path: ['variants']
        });
      }
    }
  });
