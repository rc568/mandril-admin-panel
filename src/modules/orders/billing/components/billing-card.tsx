import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { Ban, FilePenLine, MoreHorizontal, Send } from 'lucide-react';
import { useState } from 'react';
import { CLIENT_DOCUMENT_TYPE_CONFIG, NO_INFO } from '../../constants/order.constants';
import type { OrderMapped } from '../../interfaces/ui';
import { BILLING_STATUS_CONFIG, INVOICE_TYPE_CONFIG } from '../constants/billing.constants';
import type { BillingStatus } from '../interfaces/api';
import { BaseBadge } from '../../components/base-badge';
import { EditBillingDialog } from './edit-billing-dialog';
import { IssueBillingDialog } from './issue-billing-dialog';
import { VoidBillingDialog } from './void-billing-dialog';

type Billing = OrderMapped['billing'][number];

interface Props {
  billing: Billing;
}

const ACTIONS_BY_STATUS: Record<BillingStatus, ('edit' | 'issue' | 'void')[]> = {
  PENDING: ['edit', 'issue'],
  ISSUED: ['void'],
  VOIDED: []
};

export const BillingCard = ({ billing }: Props) => {
  const [dialog, setDialog] = useState<'edit' | 'issue' | 'void' | null>(null);
  const actions = ACTIONS_BY_STATUS[billing.status];

  return (
    <>
      <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1 text-sm font-medium uppercase">
            <div className="flex flex-wrap items-center gap-2">
              <span>{INVOICE_TYPE_CONFIG[billing.billingReceiptType].label}</span>
              <BaseBadge
                label={BILLING_STATUS_CONFIG[billing.status].label}
                className={cn(BILLING_STATUS_CONFIG[billing.status].className, 'bg-transparent normal-case')}
              />
            </div>
            <span className="block truncate font-normal italic text-muted-foreground">{billing.code ?? NO_INFO}</span>
          </div>
          {actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Acciones del comprobante"
                  className="size-8 shrink-0 p-0"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.includes('edit') && (
                  <DropdownMenuItem onSelect={() => setDialog('edit')} className="cursor-pointer">
                    <FilePenLine className="size-4" />
                    Editar comprobante
                  </DropdownMenuItem>
                )}
                {actions.includes('issue') && (
                  <DropdownMenuItem onSelect={() => setDialog('issue')} className="cursor-pointer">
                    <Send className="size-4" />
                    Emitir comprobante
                  </DropdownMenuItem>
                )}
                {actions.includes('void') && (
                  <DropdownMenuItem
                    onSelect={() => setDialog('void')}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Ban className="size-4" />
                    Anular comprobante
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Importe</dt>
            <dd className="font-medium text-foreground">{formatCurrency(billing.amount)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted-foreground">Razón social</dt>
            <dd className="text-foreground">{billing.billingName || NO_INFO}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Tipo de documento</dt>
            <dd className="text-foreground">{CLIENT_DOCUMENT_TYPE_CONFIG[billing.billingDocumentNumberType].label}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Número de documento</dt>
            <dd className="text-foreground">{billing.billingDocumentNumber ?? NO_INFO}</dd>
          </div>
        </div>

        <Separator />
        <div className="flex justify-between gap-3 text-xs italic text-muted-foreground">
          <span>{formatDate(billing.createdAt)}</span>
          <span className="text-right">Creado por {billing.createdBy}</span>
        </div>
      </div>

      <EditBillingDialog billing={billing} open={dialog === 'edit'} onOpenChange={(open) => !open && setDialog(null)} />
      <IssueBillingDialog
        billing={billing}
        open={dialog === 'issue'}
        onOpenChange={(open) => !open && setDialog(null)}
      />
      <VoidBillingDialog billing={billing} open={dialog === 'void'} onOpenChange={(open) => !open && setDialog(null)} />
    </>
  );
};
