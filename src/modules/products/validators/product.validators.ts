import { z } from '../../../lib/zod';

// const productAttributeSchema = z.array(z.object({
//     attributeId: z.int()
// }))

const variantAttributeValueMapSchema = z.array(
  z.object({
    attributeId: z.int(),
    valueId: z.int()
  })
);

const productVariantSchema = z.object({
  price: z
    .number()
    .positive()
    .transform((p) => p.toFixed(6)),
  purchasePrice: z
    .number()
    .positive()
    .transform((p) => p.toFixed(6)),
  quantityInStock: z.number().int().min(0).optional().default(0)
});

export const productEditSchema = z
  .object({
    name: z.string().max(255),
    slug: z
      .string()
      .max(255)
      .regex(/^[0-9a-z-]+$/),
    description: z.string().optional(),
    categoryId: z.int(),
    catalogId: z.int()
  })
  .extend({
    // isActive: z.boolean().optional(),
    variants: z
      .array(
        productVariantSchema.partial().extend({
          variantId: z.int(),
          isActive: z.boolean().optional(),
          attributes: variantAttributeValueMapSchema.optional()
        })
      )
      .optional()
  })
  .partial()
  .check((ctx) => {
    if (ctx.value.variants && ctx.value.variants.length > 0) {
      const uniqueVariants = new Set<number>();

      for (const variant of ctx.value.variants) {
        uniqueVariants.add(variant.variantId);
        if (variant.attributes) {
          const uniqueAttribues = new Set(variant.attributes.map((attr) => attr.attributeId));

          if (variant.attributes.length !== uniqueAttribues.size) {
            ctx.issues.push({
              code: 'custom',
              input: ctx.value,
              message: 'Los atributos de la variante no son consistentes o están duplicados.',
              //   message: errorMessages.product.variantAttributesNotConsistent,
              path: ['variants', 'attributes']
            });
          }
        }
      }

      if (ctx.value.variants.length !== uniqueVariants.size) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          message: 'Existen variantes duplicadas en la petición.',
          //   message: errorMessages.product.duplicatedVariants,
          path: ['variants']
        });
      }
    }
  });
