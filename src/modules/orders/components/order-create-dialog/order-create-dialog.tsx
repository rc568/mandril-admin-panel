import { FormErrorMessage } from '@/components/common/form-error-message';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { commonMessages } from '@/constants/messages';
import { useOrderMutation } from '@/hooks/query/order';
import { filterNullishFields } from '@/lib/react-hook-form/utils';
import type { SearchClient } from '@/services/client/interfaces/client.interface';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { RemoveFormatting, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useController, useFieldArray, useForm, useWatch, type Path } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  CLIENT_DOCUMENT_TYPE_CONFIG,
  CLIENT_DOCUMENT_TYPE_KEYS,
  INVOICE_TYPE_CONFIG,
  INVOICE_TYPE_KEYS,
  ORDER_STATUS_OPTIONS_ARRAY
} from '../../constants/order.constants';
import type { CreateOrderForm, CreateOrderPayload } from '../../interfaces/ui';
import { createOrderSchema } from '../../validators/order.validators';
import { AddOrderProducts } from './add-order-products';
import { ExistingClientsSearchBar } from './existing-clients-search-bar';
import { SalesChannelSelectInput } from './sales-channel-select-input';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderCreateDialog = ({ open, onOpenChange }: Props) => {
  const [hasInvoice, setHasInvoice] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    control,
    formState: { errors },
    setValue,
    resetField,
    handleSubmit
  } = useForm<CreateOrderForm>({
    resolver: standardSchemaResolver(createOrderSchema),
    defaultValues: {
      status: 'PENDING',
      invoiceType: 'SIN COMPROBANTE',
      client: { documentType: 'SIN DOCUMENTO' }
    }
  });

  const { fields: productFields, append, remove } = useFieldArray({ control, name: 'products' });

  const { field: statusField } = useController({ name: 'status', control: control });
  const { field: invoiceTypeField } = useController({ name: 'invoiceType', control: control });
  const { field: documentType } = useController({ name: 'client.documentType', control: control });

  const invoiceTypeWatch = useWatch({ control: control, name: 'invoiceType' });
  const documentTypeWatch = useWatch({ control: control, name: 'client.documentType' });

  const { createOrder } = useOrderMutation();

  const toggleInvoice = () => {
    setHasInvoice((prev) => {
      const newState = !prev;

      if (!newState) {
        resetField('invoiceType');
        resetField('client.documentType');
      }

      return newState;
    });
  };

  const onSubmit = async (data: CreateOrderForm) => {
    const filtered = filterNullishFields(data);

    let payload: CreateOrderPayload;

    try {
      payload = await createOrderSchema.parseAsync(filtered);
    } catch (error) {
      toast.error(commonMessages.UNEXPECTED_ERROR);
      return;
    }

    await createOrder.mutateAsync(payload, {
      onSuccess: () => {
        onOpenChange(false);
        navigate(`/ventas`);
      }
    });
  };

  const setClientInfoToForm = (client: SearchClient) => {
    const { documentType } = client;

    const contactName = client.contactName ?? '';
    const email = client.email ?? '';
    const phoneNumber1 = client.phoneNumber1 ?? '';

    setValue('client.contactName', contactName);
    setValue('client.email', email);
    setValue('client.phoneNumber1', phoneNumber1);

    setHasInvoice(() => {
      const invoiceType = documentType === 'RUC' ? 'FACTURA' : 'BOLETA';

      setValue('invoiceType', invoiceType);
      setValue('client.documentType', client.documentType);
      setValue('client.documentNumber', client.documentNumber);
      setValue('client.bussinessName', client.bussinessName);

      return true;
    });
  };

  useEffect(() => {
    if (invoiceTypeWatch === 'FACTURA') {
      setValue('client.documentType', 'RUC');
    }

    if (documentTypeWatch === 'SIN DOCUMENTO') {
      resetField('client.documentNumber');
    }
  }, [invoiceTypeWatch, documentTypeWatch, setValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-5/6 overflow-y-scroll" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Nueva venta</DialogTitle>
          <DialogDescription>Registra los detalles de la venta</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <SalesChannelSelectInput<CreateOrderForm>
                  control={control}
                  name={'salesChannelId' as Path<CreateOrderForm>}
                  errors={errors}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Estado
                </Label>
                <Select value={statusField.value} onValueChange={(v) => statusField.onChange(v)}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {ORDER_STATUS_OPTIONS_ARRAY.map((os) => (
                      <SelectItem key={os.key} value={os.key}>
                        {os.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status?.message && <FormErrorMessage text={String(errors.status.message)} />}
              </div>
            </section>

            <Separator />

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Datos del cliente</h3>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <ExistingClientsSearchBar setClientData={setClientInfoToForm} />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="client-conctact-name" className="text-sm font-medium text-foreground">
                  Nombres de contacto
                </Label>
                <Input
                  id="client-conctact-name"
                  {...register('client.contactName')}
                  placeholder="Nombre completo"
                  className="bg-background text-sm"
                  autoComplete="off"
                />
                {errors.client?.contactName?.message && (
                  <FormErrorMessage text={String(errors.client.contactName.message)} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-phone-number-1" className="text-sm font-medium text-foreground">
                  Celular
                </Label>
                <Input
                  id="client-phone-number-1"
                  {...register('client.phoneNumber1')}
                  placeholder="+51 9XX XXX XXX"
                  className="bg-background text-sm"
                  autoComplete="off"
                />
                {errors.client?.phoneNumber1?.message && (
                  <FormErrorMessage text={String(errors.client.phoneNumber1.message)} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-email" className="text-sm font-medium text-foreground">
                  Correo
                </Label>
                <Input
                  id="client-email"
                  {...register('client.email')}
                  placeholder="ejemplo@correo.com"
                  className="bg-background text-sm"
                  autoComplete="off"
                />
                {errors.client?.email?.message && <FormErrorMessage text={String(errors.client.email.message)} />}
              </div>
            </section>

            <Separator />

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 justify-between col-span-2">
                <div className="flex items-center gap-2">
                  <RemoveFormatting className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Datos de facturación</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="invoice-check" checked={hasInvoice} onCheckedChange={() => toggleInvoice()} />
                  <Label htmlFor="invoice-check" className="text-sm text-foreground cursor-pointer">
                    Cliente solicita comprobante
                  </Label>
                </div>
              </div>

              {hasInvoice ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-type" className="text-sm">
                      Tipo de comprobante
                    </Label>
                    <Select value={invoiceTypeField.value} onValueChange={(v) => invoiceTypeField.onChange(v)}>
                      <SelectTrigger id="invoice-type" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INVOICE_TYPE_KEYS.filter((invoice) => invoice !== 'SIN COMPROBANTE').map((invoice) => (
                          <SelectItem key={invoice} value={invoice}>
                            {INVOICE_TYPE_CONFIG[invoice].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.invoiceType?.message && <FormErrorMessage text={String(errors.invoiceType.message)} />}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoice-code" className="text-sm font-medium text-foreground">
                      Código de comprobante
                    </Label>
                    <Input
                      id="invoice-code"
                      {...register('invoiceCode')}
                      className="bg-background text-sm"
                      autoComplete="off"
                      placeholder={invoiceTypeWatch === 'BOLETA' ? 'EB01-001' : 'E001-0001'}
                    />
                    {errors.invoiceCode?.message && <FormErrorMessage text={String(errors.invoiceCode.message)} />}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document-type" className="text-sm">
                      Tipo de documento
                    </Label>
                    <Select value={documentType.value} onValueChange={(v) => documentType.onChange(v)} required>
                      <SelectTrigger id="document-type" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CLIENT_DOCUMENT_TYPE_KEYS.filter((document) => {
                          if (invoiceTypeWatch === 'BOLETA') return document !== 'RUC';
                          if (invoiceTypeWatch === 'FACTURA') return document === 'RUC';
                          return false;
                        }).map((document) => (
                          <SelectItem key={document} value={document}>
                            {CLIENT_DOCUMENT_TYPE_CONFIG[document].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.client?.documentType?.message && (
                      <FormErrorMessage text={String(errors.client.documentType.message)} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-document-number" className="text-sm font-medium text-foreground">
                      Número de documento
                    </Label>
                    <Input
                      id="client-document-number"
                      {...register('client.documentNumber')}
                      placeholder="12345678"
                      className="bg-background text-sm"
                      autoComplete="off"
                      disabled={documentTypeWatch === 'SIN DOCUMENTO'}
                    />
                    {errors.client?.documentNumber?.message && (
                      <FormErrorMessage text={String(errors.client.documentNumber.message)} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bussiness-name" className="text-sm font-medium text-foreground">
                      Razón Social
                    </Label>
                    <Input
                      id="bussiness-name"
                      {...register('client.bussinessName')}
                      placeholder="CLIENTE SAC"
                      className="bg-background text-sm uppercase"
                      autoComplete="off"
                    />
                    {errors.client?.bussinessName?.message && (
                      <FormErrorMessage text={String(errors.client.bussinessName.message)} />
                    )}
                  </div>
                </>
              ) : (
                <span className="pl-2 text-sm text-muted-foreground">Esta venta se registra sin comprobante.</span>
              )}
            </section>

            <Separator />

            <section>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="order-products" className="text-sm font-semibold">
                  Productos
                </Label>
              </div>

              {errors.products?.message && <FormErrorMessage text={String(errors.products.message)} />}

              <AddOrderProducts
                products={productFields}
                addProduct={append}
                register={register}
                control={control}
                deleteProduct={remove}
              />
            </section>

            <Separator />

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="observation" className="text-sm font-medium text-foreground">
                  Observaciones
                </Label>
                <Textarea
                  id="observation"
                  {...register('observation')}
                  placeholder="Detalles adicinales sobre la venta..."
                  autoComplete="off"
                />
                {errors.observation?.message && <FormErrorMessage text={String(errors.observation.message)} />}
              </div>
            </section>

            <div className="text-right">
              <Button type="submit">Agregar venta</Button>
            </div>
          </div>
        </form>

        {/* <DialogFooter className="justify-start">
          <DialogClose asChild className="flex-1">
            <Button variant="outline" type="button">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};
