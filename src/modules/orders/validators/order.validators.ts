import { z } from '@/lib/zod';
import { baseStringSchema, emptyToUndefined, smallIntPositive } from '@/lib/zod/zod-helpers';
import { CLIENT_ONLY_DOCUMENT_TYPE_KEYS, ORDER_STATUS } from '../constants/order.constants';
import { messages } from '../constants/order.messages';

const ORDER_CREATE_STATUSES = ORDER_STATUS.filter((status) => status !== 'CANCELLED');
const ORDER_UPDATE_STATUSES = ORDER_STATUS.filter((status) => status !== 'CANCELLED' && status !== 'COMPLETED');
const DEFAULT_ORDER_TYPE = 'SALE';

export const saleOrderProductSchema = z.object({
  variantId: smallIntPositive(),
  price: z.number().min(0),
  quantity: z.number().int().min(1),
  type: z.literal('SALE')
});

const returnOrderProductSchema = z.object({
  variantId: smallIntPositive(),
  type: z.literal('RETURN'),
  quantity: z.number().int().min(1)
});

export const clientSchema = z
  .object({
    contactName: emptyToUndefined(baseStringSchema.max(255).optional()),
    email: emptyToUndefined(z.email().max(255).optional()),
    phoneNumber1: emptyToUndefined(
      z
        .string()
        .trim()
        .max(16)
        .regex(/^\+[1-9][0-9]{0,14}$/, messages.VALIDATION.PHONE_NUMBER_INVALID)
        .optional()
    ),
    phoneNumber2: emptyToUndefined(
      z
        .string()
        .trim()
        .max(16)
        .regex(/^\+[1-9][0-9]{0,14}$/, messages.VALIDATION.PHONE_NUMBER_INVALID)
        .optional()
    ),
    documentNumberType: z.enum(CLIENT_ONLY_DOCUMENT_TYPE_KEYS).optional(),
    documentNumber: emptyToUndefined(baseStringSchema.max(25).toUpperCase().optional())
  })
  .check(({ value, issues }) => {
    if (value.documentNumberType && !value.documentNumber) {
      issues.push({
        code: 'custom',
        input: value.documentNumber,
        message: messages.VALIDATION.CLIENT_DOCUMENT_NUMBER_REQUIRED,
        path: ['documentNumber']
      });
    }

    if (value.documentNumber && !value.documentNumberType) {
      issues.push({
        code: 'custom',
        input: value.documentNumberType,
        message: messages.VALIDATION.CLIENT_DOCUMENT_TYPE_REQUIRED,
        path: ['documentNumberType']
      });
    }
  });

export const createOrderSchema = z
  .object({
    type: z.literal(DEFAULT_ORDER_TYPE).default(DEFAULT_ORDER_TYPE),
    salesChannelId: smallIntPositive(),
    status: z.enum(ORDER_CREATE_STATUSES),
    observation: emptyToUndefined(baseStringSchema.optional()),
    products: z.array(saleOrderProductSchema).nonempty(),
    client: clientSchema
  })
  .check(({ value, issues }) => {
    const variantIds = value.products.map((product) => product.variantId);
    if (new Set(variantIds).size !== variantIds.length) {
      issues.push({
        code: 'custom',
        input: value.products,
        message: messages.VALIDATION.DUPLICATE_PRODUCT,
        path: ['products']
      });
    }
  });

const createExchangeOrderSchema = z
  .object({
    type: z.literal('EXCHANGE'),
    salesChannelId: smallIntPositive(),
    status: z.literal('PENDING').default('PENDING'),
    relatedOrderId: z.uuid(),
    fullReturn: z.undefined().optional(),
    observation: emptyToUndefined(baseStringSchema.optional()),
    products: z.discriminatedUnion('type', [saleOrderProductSchema, returnOrderProductSchema]).array().nonempty(),
    client: z.undefined().optional()
  })
  .check(({ value, issues }) => {
    const productKeys = value.products.map((product) => `${product.variantId}-${product.type}`);
    if (new Set(productKeys).size !== productKeys.length) {
      issues.push({
        code: 'custom',
        input: value.products,
        message: messages.VALIDATION.DUPLICATE_PRODUCT,
        path: ['products']
      });
    }

    const productTypes = new Set(value.products.map((product) => product.type));
    if (productTypes.size !== 2) {
      issues.push({
        code: 'custom',
        input: value.products,
        message: messages.VALIDATION.EXCHANGE_REQUIRES_BOTH_PRODUCT_TYPES,
        path: ['products']
      });
    }
  });

const createFullReturnOrderSchema = z.object({
  type: z.literal('RETURN'),
  salesChannelId: smallIntPositive(),
  status: z.literal('PENDING').default('PENDING'),
  relatedOrderId: z.uuid(),
  fullReturn: z.literal(true),
  observation: emptyToUndefined(baseStringSchema.optional()),
  products: z.undefined().optional(),
  client: z.undefined().optional()
});

const createPartialReturnOrderSchema = z
  .object({
    type: z.literal('RETURN'),
    salesChannelId: smallIntPositive(),
    status: z.literal('PENDING').default('PENDING'),
    relatedOrderId: z.uuid(),
    fullReturn: z.literal(false),
    observation: emptyToUndefined(baseStringSchema.optional()),
    products: z.array(returnOrderProductSchema).nonempty(),
    client: z.undefined().optional()
  })
  .check(({ value, issues }) => {
    const variantIds = value.products.map((product) => product.variantId);
    if (new Set(variantIds).size !== variantIds.length) {
      issues.push({
        code: 'custom',
        input: value.products,
        message: messages.VALIDATION.DUPLICATE_PRODUCT,
        path: ['products']
      });
    }
  });

const createReturnOrderSchema = z.discriminatedUnion('fullReturn', [
  createFullReturnOrderSchema,
  createPartialReturnOrderSchema
]);

export const createRelatedOrderSchema = z.discriminatedUnion('type', [
  createExchangeOrderSchema,
  createReturnOrderSchema
]);

export const updateOrderSchema = z
  .object({
    salesChannelId: smallIntPositive().optional(),
    status: z.enum(ORDER_UPDATE_STATUSES).optional(),
    observation: emptyToUndefined(baseStringSchema.optional()),
    products: z.array(saleOrderProductSchema).nonempty().optional(),
    client: clientSchema.optional()
  })
  .check(({ value, issues }) => {
    if (value.products) {
      const variantIds = value.products.map((product) => product.variantId);
      if (new Set(variantIds).size !== variantIds.length) {
        issues.push({
          code: 'custom',
          input: value.products,
          message: messages.VALIDATION.DUPLICATE_PRODUCT,
          path: ['products']
        });
      }
    }
  });
