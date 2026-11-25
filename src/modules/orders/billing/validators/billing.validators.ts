import { z } from '@/lib/zod';
import { baseStringSchema, emptyToUndefined } from '@/lib/zod/zod-helpers';
import {
  BILLING_VALIDATION_MESSAGES,
  IDENTITY_DOCUMENT_TYPE_KEYS,
  INVOICE_CODE_BOLETA_REGEX,
  INVOICE_CODE_FACTURA_REGEX,
  RUC_REGEX
} from '../constants/billing.constants';

export const createBillingSchema = z
  .object({
    status: z.enum(['PENDING', 'ISSUED']),
    amount: z.coerce.number().positive(BILLING_VALIDATION_MESSAGES.AMOUNT_MUST_BE_POSITIVE),
    billingName: z
      .string()
      .trim()
      .min(1, BILLING_VALIDATION_MESSAGES.BILLING_NAME_REQUIRED)
      .max(255, 'La razón social no puede superar los 255 caracteres.'),
    billingAddress: emptyToUndefined(baseStringSchema.max(255).optional()),
    note: emptyToUndefined(baseStringSchema.max(600).optional()),
    billingReceiptType: z.enum(['FACTURA', 'BOLETA']),
    billingDocumentNumberType: z.enum(IDENTITY_DOCUMENT_TYPE_KEYS),
    billingDocumentNumber: emptyToUndefined(z.string().trim().max(25).optional()),
    code: emptyToUndefined(z.string().trim().max(50).optional())
  })
  .check(({ value, issues }) => {
    if (value.billingReceiptType === 'FACTURA') {
      if (value.billingDocumentNumberType !== 'RUC') {
        issues.push({
          code: 'custom',
          input: value.billingDocumentNumberType,
          message: BILLING_VALIDATION_MESSAGES.DOCUMENT_TYPE_INVALID_FOR_INVOICE,
          path: ['billingDocumentNumberType']
        });
      }
      if (value.billingDocumentNumber && !RUC_REGEX.test(value.billingDocumentNumber)) {
        issues.push({
          code: 'custom',
          input: value.billingDocumentNumber,
          message: BILLING_VALIDATION_MESSAGES.RUC_INVALID,
          path: ['billingDocumentNumber']
        });
      } else if (!value.billingDocumentNumber) {
        issues.push({
          code: 'custom',
          input: value.billingDocumentNumber,
          message: BILLING_VALIDATION_MESSAGES.DOCUMENT_NUMBER_REQUIRED,
          path: ['billingDocumentNumber']
        });
      }
    } else {
      if (value.billingDocumentNumberType === 'RUC') {
        issues.push({
          code: 'custom',
          input: value.billingDocumentNumberType,
          message: BILLING_VALIDATION_MESSAGES.DOCUMENT_TYPE_INVALID_FOR_RECEIPT,
          path: ['billingDocumentNumberType']
        });
      } else if (value.billingDocumentNumberType === 'SIN DOCUMENTO' && value.billingDocumentNumber) {
        issues.push({
          code: 'custom',
          input: value.billingDocumentNumber,
          message: BILLING_VALIDATION_MESSAGES.DOCUMENT_NUMBER_NOT_ALLOWED,
          path: ['billingDocumentNumber']
        });
      } else if (value.billingDocumentNumberType !== 'SIN DOCUMENTO' && !value.billingDocumentNumber) {
        issues.push({
          code: 'custom',
          input: value.billingDocumentNumber,
          message: BILLING_VALIDATION_MESSAGES.DOCUMENT_NUMBER_REQUIRED,
          path: ['billingDocumentNumber']
        });
      }
    }

    if (value.status === 'PENDING' && value.code) {
      issues.push({
        code: 'custom',
        input: value.code,
        message: BILLING_VALIDATION_MESSAGES.CODE_NOT_ALLOWED_ON_PENDING,
        path: ['code']
      });
    }

    if (value.status === 'ISSUED') {
      if (!value.code) {
        issues.push({
          code: 'custom',
          input: value.code,
          message: BILLING_VALIDATION_MESSAGES.BILLING_CODE_REQUIRED,
          path: ['code']
        });
      } else {
        const codeRegex =
          value.billingReceiptType === 'FACTURA' ? INVOICE_CODE_FACTURA_REGEX : INVOICE_CODE_BOLETA_REGEX;
        if (!codeRegex.test(value.code)) {
          issues.push({
            code: 'custom',
            input: value.code,
            message: BILLING_VALIDATION_MESSAGES.BILLING_CODE_INVALID,
            path: ['code']
          });
        }
      }
    }
  });
