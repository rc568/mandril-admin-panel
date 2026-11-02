import { z } from '@/lib/zod';
import { baseStringSchema, emptyToUndefined, smallIntPositive } from '@/lib/zod/zod-helpers';
import { CLIENT_ONLY_DOCUMENT_TYPE_KEYS, ORDER_STATUS } from '../constants/order.constants';
import { messages } from '../constants/order.messages';

const ORDER_CREATE_STATUSES = ORDER_STATUS.filter((status) => status !== 'CANCELLED');
const DEFAULT_ORDER_TYPE = 'SALE';
const DEFAULT_ORDER_PRODUCT_TYPE = 'SALE';

export const orderProductSchema = z.object({
  variantId: smallIntPositive(),
  price: z.number().min(0),
  quantity: z.number().int().min(1),
  type: z.literal(DEFAULT_ORDER_PRODUCT_TYPE).default(DEFAULT_ORDER_PRODUCT_TYPE)
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
    products: z.array(orderProductSchema).nonempty(),
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
