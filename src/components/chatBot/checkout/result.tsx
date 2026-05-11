import { useState } from 'react';
import { CheckIcon, CopyIcon, XCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  AgentAuthorization,
  type AgentAuthorizationResult,
} from './agentAuthorization';

export type ReceiptItem = {
  id: string;
  name: string;
  color?: string;
  imageSrc: string;
  imageAlt: string;
  quantity: number;
  price: number;
};

export type CheckoutResult =
  | {
      status: 'success';
      transactionId: string;
      currency: string;
      total: number;
      items: ReceiptItem[];
      paymentMethod: 'card' | 'apple_pay';
    }
  | { status: 'cancelled'; message: string };

export function CheckoutResultBadge({
  customerId,
  output,
  onAgentAuthorized,
}: {
  customerId: string;
  output: CheckoutResult;
  onAgentAuthorized?: (result: AgentAuthorizationResult) => void;
}) {
  const { t } = useTranslation();
  if (output.status === 'success') {
    return (
      <SuccessReceipt
        {...output}
        customerId={customerId}
        onAgentAuthorized={onAgentAuthorized}
      />
    );
  }

  return (
    <div
      data-fill-bubble
      className="flex w-full items-start gap-2 rounded-lg border border-border/60 bg-muted/40 p-2.5 text-xs"
    >
      <XCircleIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="font-medium text-foreground">
          {t('chatBot.checkout.result.cancelled')}
        </p>
        <p className="text-[11px] text-muted-foreground">{output.message}</p>
      </div>
    </div>
  );
}

function SuccessReceipt({
  customerId,
  transactionId,
  currency,
  total,
  items,
  paymentMethod,
  onAgentAuthorized,
}: {
  customerId: string;
  transactionId: string;
  currency: string;
  total: number;
  items: ReceiptItem[];
  paymentMethod: 'card' | 'apple_pay';
  onAgentAuthorized?: (result: AgentAuthorizationResult) => void;
}) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  return (
    <div
      data-fill-bubble
      className="w-full overflow-hidden rounded-xl border border-emerald-500/30 bg-background shadow-sm"
    >
      <div className="flex items-center gap-2.5 bg-emerald-500/[0.06] px-3 py-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
          <CheckIcon
            className="size-3.5 text-emerald-700 dark:text-emerald-400"
            strokeWidth={3}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-700/80 dark:text-emerald-400/80">
            {t('chatBot.checkout.result.confirmed')}
          </p>
          <p className="truncate text-xs font-semibold text-foreground">
            {t('chatBot.checkout.result.thankYou')}
          </p>
        </div>
      </div>

      <ul className="divide-y divide-border/60 px-3">
        {items.map(item => {
          const lineTotal = item.price * item.quantity;
          return (
            <li key={item.id} className="flex items-center gap-2.5 py-2.5">
              <div className="size-10 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-border/60">
                <img
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  className="size-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium leading-snug text-foreground">
                  {item.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  <span className="font-mono tabular-nums">
                    <span className="font-semibold text-foreground/80">
                      {item.quantity}
                    </span>
                    <span className="mx-1 text-muted-foreground/60">×</span>
                    {item.price.toFixed(2)}
                  </span>
                  {item.color && (
                    <>
                      <span className="mx-1 text-muted-foreground/40">·</span>
                      <span className="text-foreground/60">{item.color}</span>
                    </>
                  )}
                </p>
              </div>

              <p className="font-mono text-xs font-medium tabular-nums text-foreground">
                {lineTotal.toFixed(2)}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-dashed border-border/80 px-3 py-2.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t('chatBot.checkout.result.total')}
          </span>
          <span className="flex items-baseline gap-1">
            <span className="font-mono text-base font-semibold tabular-nums text-foreground">
              {total.toFixed(2)}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {currency}
            </span>
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(transactionId);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        }}
        className="group flex w-full items-center justify-between gap-2 border-t border-border/60 bg-muted/30 px-3 py-2 text-left transition-colors hover:bg-muted/50"
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {t('chatBot.checkout.result.txnId')}
        </span>
        <span className="flex min-w-0 items-center gap-1.5">
          <code className="truncate font-mono text-[10px] text-muted-foreground/90 group-hover:text-foreground">
            {transactionId}
          </code>
          {copied ? (
            <CheckIcon
              className="size-3 shrink-0 text-emerald-600 dark:text-emerald-400"
              strokeWidth={3}
            />
          ) : (
            <CopyIcon className="size-3 shrink-0 text-muted-foreground/60 group-hover:text-foreground" />
          )}
        </span>
      </button>

      {paymentMethod !== 'apple_pay' && (
        <AgentAuthorization
          customerId={customerId}
          onResult={onAgentAuthorized}
        />
      )}
    </div>
  );
}
