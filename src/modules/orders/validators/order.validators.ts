import { z } from '@/lib/zod';
import { baseStringSchema, optionalString } from '@/lib/zod/zod-helpers';
import {
  CLIENT_DOCUMENT_TYPE_KEYS,
  INVOICE_CODE_BOLETA_REGEX,
  INVOICE_CODE_FACTURA_REGEX,
  ORDER_STATUS,
  RUC_REGEX
} from '../constants/order.constants';

const boletaDocumentTypes = CLIENT_DOCUMENT_TYPE_KEYS.filter((type) => type !== 'RUC');

export const orderProductSchema = z.object({
  variantId: z.int(),
  price: z.number().min(0),
  quantity: z.coerce.number().int().min(1)
});

const baseClientSchema = z.object({
  contactName: optionalString(baseStringSchema.max(255)),
  email: optionalString(z.email().max(255)),
  phoneNumber1: optionalString(baseStringSchema.max(25)),
  phoneNumber2: optionalString(baseStringSchema.max(25))
});

const baseOrderSchema = z.object({
  salesChannelId: z.int().positive(),
  status: z.enum(ORDER_STATUS).default('PENDING'),
  observation: optionalString(baseStringSchema),
  products: z.array(orderProductSchema).nonempty(),
  client: baseClientSchema
});

export const invoiceSchema = z.discriminatedUnion('invoiceType', [
  z.object({
    invoiceType: z.literal('SIN COMPROBANTE'),
    client: z.object({
      documentType: z.literal('SIN DOCUMENTO')
    })
  }),
  z.object({
    invoiceType: z.literal('FACTURA'),
    invoiceCode: z.string().regex(INVOICE_CODE_FACTURA_REGEX),
    client: z.object({
      documentType: z.literal('RUC'),
      documentNumber: z.string().regex(RUC_REGEX),
      bussinessName: baseStringSchema.max(255).toUpperCase()
    })
  }),
  z.object({
    invoiceType: z.literal('BOLETA'),
    invoiceCode: z.string().regex(INVOICE_CODE_BOLETA_REGEX),
    client: z.object({
      documentType: z.enum(boletaDocumentTypes),
      documentNumber: optionalString(baseStringSchema.max(25).toUpperCase()),
      bussinessName: baseStringSchema.max(255).toUpperCase()
    })
  })
]);

export const createOrderSchema = baseOrderSchema.and(invoiceSchema).check(({ issues, value }) => {
  if (value.invoiceType === 'BOLETA' && value.client.documentType !== 'SIN DOCUMENTO') {
    if (!value.client.documentNumber) {
      issues.push({
        code: 'custom',
        input: value.client.documentNumber,
        message: 'Debe definirse el número de documento.',
        path: ['client', 'documentNumber']
      });
    }
  }

  if (value.invoiceType === 'BOLETA' && value.client.documentType === 'SIN DOCUMENTO') {
    if (value.client.documentNumber) {
      issues.push({
        code: 'custom',
        input: value.client.documentNumber,
        message: 'No debe definirse un número de documento para esta opción.',
        path: ['client', 'documentNumber']
      });
    }
  }
});
