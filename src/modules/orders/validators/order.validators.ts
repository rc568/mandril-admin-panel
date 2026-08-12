import { z } from '@/lib/zod';
import {
  baseTextSchema,
  emailSchema,
  integerId,
  integerPositiveNumber,
  nonNegativeNumber,
  optionalString,
  regexSchema
} from '@/validators/primitives';
import {
  CLIENT_DOCUMENT_TYPE_KEYS,
  INVOICE_CODE_BOLETA_REGEX,
  INVOICE_CODE_FACTURA_REGEX,
  ORDER_STATUS,
  RUC_REGEX
} from '../constants/order.constants';
import { messages } from '../constants/order.messages';

const boletaDocumentTypes = CLIENT_DOCUMENT_TYPE_KEYS.filter((type) => type !== 'RUC');

export const orderProductSchema = z.object({
  variantId: integerId,
  price: nonNegativeNumber,
  quantity: integerPositiveNumber
});

const baseClientSchema = z.object({
  contactName: optionalString(baseTextSchema(1, 255)),
  email: optionalString(emailSchema),
  phoneNumber1: optionalString(baseTextSchema(1, 25)),
  phoneNumber2: optionalString(baseTextSchema(1, 25))
});

const baseOrderSchema = z.object({
  salesChannelId: integerId,
  status: z.enum(ORDER_STATUS).default('PENDING'),
  observation: optionalString(baseTextSchema(1)),
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
    invoiceCode: regexSchema(INVOICE_CODE_FACTURA_REGEX, messages.FACTURA_REGEX),
    client: z.object({
      documentType: z.literal('RUC'),
      documentNumber: regexSchema(RUC_REGEX, messages.RUC_REGEX),
      bussinessName: baseTextSchema(1, 255).toUpperCase()
    })
  }),
  z.object({
    invoiceType: z.literal('BOLETA'),
    invoiceCode: regexSchema(INVOICE_CODE_BOLETA_REGEX, messages.BOLETA_REGEX),
    client: z.object({
      documentType: z.enum(boletaDocumentTypes),
      documentNumber: optionalString(baseTextSchema(1, 25).toUpperCase()),
      bussinessName: baseTextSchema(1, 255).toUpperCase()
    })
  })
]);

export const createOrderSchema = baseOrderSchema.and(invoiceSchema).check(({ issues, value }) => {
  if (value.invoiceType === 'BOLETA' && value.client.documentType !== 'SIN DOCUMENTO') {
    if (!value.client.documentNumber) {
      issues.push({
        code: 'custom',
        input: value.client.documentNumber,
        message: messages.MISSING_DOCUMENT_NUMBER,
        path: ['client', 'documentNumber']
      });
    }
  }

  if (value.invoiceType === 'BOLETA' && value.client.documentType === 'SIN DOCUMENTO') {
    if (value.client.documentNumber) {
      issues.push({
        code: 'custom',
        input: value.client.documentNumber,
        message: messages.DOCUMENT_NUMBER_NOT_REQUIRED,
        path: ['client', 'documentNumber']
      });
    }
  }
});
