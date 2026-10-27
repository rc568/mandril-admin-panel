import { z } from '../../../lib/zod';

const productAttributeSchema = z.array(
  z.object({
    attributeId: z.int().min(1).max(32767)
  })
);

const variantAttributeValueMapSchema = z.array(
  z.object({
    attributeId: z.int().min(1).max(32767),
    valueId: z.int().min(1).max(32767)
  })
);

export const productVariantSchema = z.object({
  price: z.number().positive(),
  purchasePrice: z.number().positive(),
  attributes: variantAttributeValueMapSchema.optional()
});

export const baseProductSchema = z.object({
  name: z.string().min(3).max(255),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[0-9a-z-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones.'),
  description: z.string().optional(),
  categoryId: z.int().min(1).max(32767),
  catalogId: z.int().min(1).max(32767),
  attributesId: productAttributeSchema.optional()
});

export const createProductSchema = baseProductSchema
  .extend({
    variants: z.array(productVariantSchema).nonempty()
  })
  .check(({ value, issues }) => {
    const productAttributeIds = (value.attributesId ?? []).map(({ attributeId }) => attributeId);
    const uniqueProductAttributeIds = new Set(productAttributeIds);

    if (uniqueProductAttributeIds.size !== productAttributeIds.length) {
      issues.push({
        code: 'custom',
        input: value,
        message: 'No puedes repetir atributos del producto.',
        path: ['attributesId']
      });
    }

    if (productAttributeIds.length === 0) {
      if (value.variants.length > 1 || value.variants.some((variant) => (variant.attributes?.length ?? 0) > 0)) {
        issues.push({
          code: 'custom',
          input: value,
          message: 'Selecciona atributos para registrar más de una variante.',
          path: ['attributesId']
        });
      }
      return;
    }

    if (value.variants.length === 1) {
      issues.push({
        code: 'custom',
        input: value,
        message: 'Un producto con atributos debe tener al menos dos variantes.',
        path: ['attributesId']
      });
    }

    const variantCombinations = new Set<string>();

    value.variants.forEach((variant) => {
      const variantAttributes = variant.attributes ?? [];
      const variantAttributeIds = variantAttributes.map(({ attributeId }) => attributeId);
      const uniqueVariantAttributeIds = new Set(variantAttributeIds);
      const hasExpectedAttributes =
        variantAttributeIds.length === productAttributeIds.length &&
        uniqueVariantAttributeIds.size === variantAttributeIds.length &&
        productAttributeIds.every((attributeId) => uniqueVariantAttributeIds.has(attributeId));

      if (!hasExpectedAttributes) {
        issues.push({
          code: 'custom',
          input: value,
          message: 'Completa un valor para cada atributo seleccionado en todas las variantes.',
          path: ['attributesId']
        });
        return;
      }

      const combination = variantAttributes
        .map(({ attributeId, valueId }) => `${attributeId}:${valueId}`)
        .sort()
        .join('|');

      if (variantCombinations.has(combination)) {
        issues.push({
          code: 'custom',
          input: value,
          message: 'No puedes crear dos variantes con la misma combinación de atributos.',
          path: ['attributesId']
        });
      }

      variantCombinations.add(combination);
    });
  });

export const editProductSchema = baseProductSchema
  .extend({
    // isActive: z.boolean().optional(),

    variants: z
      .array(
        productVariantSchema.extend({
          variantId: z.int().optional(),
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
              message: 'Los atributos de la variante no son consistentes o están duplicados.',
              //   message: errorMessages.product.variantAttributesNotConsistent,
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
          message: 'Existen variantes duplicadas en la petición.',
          //   message: errorMessages.product.duplicatedVariants,
          path: ['variants']
        });
      }
    }
  });
