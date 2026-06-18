import { type BinLookUpData } from '@moneyhash/js-sdk/headless';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import formatCurrency from '@/utils/formatCurrency';
import type { Currency } from '@/utils/productSections';

type BinDiscountDialogProps = {
  open: boolean;
  binLookup: BinLookUpData | null;
  discountPercentage: number;
  originalAmount: number;
  discountedAmount: number;
  currency: Currency;
  onConfirm: () => void;
  onCancel: () => void;
};

export function BinDiscountDialog({
  open,
  binLookup,
  discountPercentage,
  originalAmount,
  discountedAmount,
  currency,
  onConfirm,
  onCancel,
}: BinDiscountDialogProps) {
  const { t } = useTranslation();
  const hasDiscount = discountPercentage > 0;

  const rows: { label: string; value: string | null }[] = [
    { label: t('binDiscount.brand'), value: binLookup?.brand ?? null },
    { label: t('binDiscount.issuer'), value: binLookup?.issuer ?? null },
    {
      label: t('binDiscount.issuerCountry'),
      value: binLookup?.issuerCountry ?? null,
    },
    { label: t('binDiscount.cardType'), value: binLookup?.cardType ?? null },
    {
      label: t('binDiscount.firstSixDigits'),
      value: binLookup?.firstSixDigits ?? null,
    },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) onCancel();
      }}
    >
      <DialogContent hideClose>
        <DialogHeader>
          <DialogTitle>
            {hasDiscount
              ? t('binDiscount.title')
              : t('binDiscount.noDiscountTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('binDiscount.lookupDescription')}
          </DialogDescription>
        </DialogHeader>

        {/* BIN lookup result */}
        <dl className="divide-y divide-border rounded-md border border-input">
          {rows.map(row => (
            <div
              key={row.label}
              className="flex items-center justify-between px-3 py-2 text-sm"
            >
              <dt className="text-subtle">{row.label}</dt>
              <dd className="font-medium text-bolder">{row.value ?? '—'}</dd>
            </div>
          ))}
        </dl>

        {/* Discount highlight */}
        {hasDiscount && (
          <div className="rounded-md bg-orange-500/10 px-3 py-2 text-sm text-orange-700 dark:text-orange-400">
            {t('binDiscount.discountReason', {
              brand: binLookup?.brand,
              percentage: discountPercentage,
            })}
          </div>
        )}

        {/* Totals */}
        <dl className="space-y-1 border-t border-border pt-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-subtle">{t('binDiscount.originalTotal')}</dt>
            <dd
              className={
                hasDiscount ? 'text-subtle line-through' : 'text-bolder'
              }
            >
              {formatCurrency({ currency, amount: originalAmount })}
            </dd>
          </div>
          {hasDiscount && (
            <div className="flex items-center justify-between text-base font-medium">
              <dt>{t('binDiscount.newTotal')}</dt>
              <dd>{formatCurrency({ currency, amount: discountedAmount })}</dd>
            </div>
          )}
        </dl>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {t('binDiscount.cancel')}
          </Button>
          <Button onClick={onConfirm}>{t('binDiscount.confirm')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
