import { z } from '../../../lib/zod';
import { smallIntPositive } from '../../../lib/zod/zod-helpers';
import { messages } from '../constants/products.messages';

const productAttributeSchema = z.array(
  z.object({
    attributeId: smallIntPositive()
  })
);

const variantAttributeValueMapSchema = z.array(
  z.object({
    attributeId: smallIntPositive(),
    valueId: smallIntPositive()
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
    .regex(/^[0-9a-z-]+$/, messages.VALIDATION.SLUG_FORMAT),
  description: z.string().optional(),
  categoryId: smallIntPositive(),
  catalogId: smallIntPositive(),
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
        message: messages.VALIDATION.DUPLICATE_PRODUCT_ATTRIBUTES,
        path: ['attributesId']
      });
    }

    if (productAttributeIds.length === 0) {
      if (value.variants.length > 1 || value.variants.some((variant) => (variant.attributes?.length ?? 0) > 0)) {
        issues.push({
          code: 'custom',
          input: value,
          message: messages.VALIDATION.ATTRIBUTES_REQUIRED_FOR_MULTIPLE_VARIANTS,
          path: ['attributesId']
        });
      }
      return;
    }

    if (value.variants.length === 1) {
      issues.push({
        code: 'custom',
        input: value,
        message: messages.VALIDATION.MINIMUM_VARIANTS_WITH_ATTRIBUTES,
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
          message: messages.VALIDATION.ALL_VARIANT_ATTRIBUTES_REQUIRED,
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
          message: messages.VALIDATION.DUPLICATE_VARIANT_COMBINATION,
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
          variantId: smallIntPositive().optional(),
          isActive: z.boolean()
        })
      )
      .optional()
  })
  .partial()
  .check((ctx) => {
    const productAttributeIds = ctx.value.attributesId?.map((attribute) => attribute.attributeId) ?? [];

    if (new Set(productAttributeIds).size !== productAttributeIds.length) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        message: messages.VALIDATION.DUPLICATE_PRODUCT_ATTRIBUTES,
        path: ['attributesId']
      });
    }

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
              message: messages.VALIDATION.INCONSISTENT_VARIANT_ATTRIBUTES,
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
          message: messages.VALIDATION.DUPLICATE_VARIANTS,
          path: ['variants']
        });
      }

      if (productAttributeIds.length === 0) {
        if (
          ctx.value.variants.length > 1 ||
          ctx.value.variants.some((variant) => (variant.attributes?.length ?? 0) > 0)
        ) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value,
            message: messages.VALIDATION.ATTRIBUTES_REQUIRED_FOR_MULTIPLE_VARIANTS,
            path: ['attributesId']
          });
        }
        return;
      }

      if (ctx.value.variants.length === 1) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          message: messages.VALIDATION.MINIMUM_VARIANTS_WITH_ATTRIBUTES,
          path: ['attributesId']
        });
      }

      const variantCombinations = new Set<string>();

      ctx.value.variants.forEach((variant) => {
        const variantAttributes = variant.attributes ?? [];
        const variantAttributeIds = variantAttributes.map(({ attributeId }) => attributeId);
        const uniqueVariantAttributeIds = new Set(variantAttributeIds);
        const hasExpectedAttributes =
          variantAttributeIds.length === productAttributeIds.length &&
          uniqueVariantAttributeIds.size === variantAttributeIds.length &&
          productAttributeIds.every((attributeId) => uniqueVariantAttributeIds.has(attributeId));

        if (!hasExpectedAttributes) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value,
            message: messages.VALIDATION.ALL_VARIANT_ATTRIBUTES_REQUIRED,
            path: ['attributesId']
          });
          return;
        }

        const combination = variantAttributes
          .map(({ attributeId, valueId }) => `${attributeId}:${valueId}`)
          .sort()
          .join('|');

        if (variantCombinations.has(combination)) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value,
            message: messages.VALIDATION.DUPLICATE_VARIANT_COMBINATION,
            path: ['attributesId']
          });
        }

        variantCombinations.add(combination);
      });
    }
  });
