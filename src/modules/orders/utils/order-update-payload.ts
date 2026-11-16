import type { UpdateOrderPayload } from '../interfaces/api';
import type { UpdateOrderForm } from '../interfaces/ui/update-order-form.interface';

const CLIENT_FIELDS = ['contactName', 'email', 'phoneNumber1', 'phoneNumber2'] as const;

interface Result {
  payload: UpdateOrderPayload;
  hasUnsupportedClearing: boolean;
}

export const getOrderUpdatePayload = (data: UpdateOrderForm, initialValues: UpdateOrderForm): Result => {
  const payload: UpdateOrderPayload = {};
  let hasUnsupportedClearing = false;

  if (data.salesChannelId !== undefined && data.salesChannelId !== initialValues.salesChannelId) {
    payload.salesChannelId = data.salesChannelId;
  }
  if (data.status !== undefined && data.status !== initialValues.status) payload.status = data.status;

  const observation = (data.observation ?? '').trim();
  const initialObservation = (initialValues.observation ?? '').trim();
  if (observation !== initialObservation) {
    if (!observation && initialObservation) hasUnsupportedClearing = true;
    else if (observation) payload.observation = observation;
  }

  const initialProducts = new Map(initialValues.products.map((product) => [product.variantId, product]));
  const productsChanged =
    data.products.length !== initialValues.products.length ||
    data.products.some((product) => {
      const initialProduct = initialProducts.get(product.variantId);
      return !initialProduct || initialProduct.quantity !== product.quantity || initialProduct.price !== product.price;
    });

  if (productsChanged && data.products.length > 0) {
    payload.products = data.products.map(({ variantId, type, price, quantity }) => ({
      variantId,
      type,
      price,
      quantity
    })) as NonNullable<UpdateOrderPayload['products']>;
  }

  const client: NonNullable<UpdateOrderPayload['client']> = {};
  for (const field of CLIENT_FIELDS) {
    const currentValue = data.client?.[field] ?? '';
    const initialValue = initialValues.client?.[field] ?? '';
    if (currentValue === initialValue) continue;

    if (!currentValue && initialValue) {
      hasUnsupportedClearing = true;
      continue;
    }

    if (!currentValue) continue;

    client[field] = currentValue;
  }

  const documentNumberType = data.client?.documentNumberType;
  const documentNumber = data.client?.documentNumber;
  const documentNumberTypeChanged = documentNumberType !== initialValues.client?.documentNumberType;
  const documentNumberChanged = documentNumber !== initialValues.client?.documentNumber;

  if ((documentNumberTypeChanged || documentNumberChanged) && documentNumberType && documentNumber) {
    client.documentNumberType = documentNumberType;
    client.documentNumber = documentNumber;
  }

  if (Object.keys(client).length > 0) payload.client = client;

  return { payload, hasUnsupportedClearing };
};
