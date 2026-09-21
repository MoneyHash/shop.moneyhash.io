import { useState } from 'react';
import {
  CalendarClockIcon,
  CheckIcon,
  CopyIcon,
  ImageIcon,
  XCircleIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { Receipt } from './types';

// Renders a completed agentic payment receipt. Used both for immediate charges
// (from the executeAgenticPayment tool output) and deferred "pay later" charges
// (pushed into the chat over SSE once the queued charge lands).
export function AgenticReceipt({ receipt }: { receipt: Receipt }) {
  const { t } = useTranslation();

  if (receipt.kind === 'failed') {
    return <FailedReceipt receipt={receipt} />;
  }

  const title =
    receipt.kind === 'scheduled'
      ? t('chatBot.checkout.receipt.scheduledTitle')
      : t('chatBot.checkout.receipt.immediateTitle');
  const subtitle =
    receipt.kind === 'scheduled'
      ? t('chatBot.checkout.receipt.scheduledSubtitle')
      : t('chatBot.checkout.receipt.immediateSubtitle');

  return (
    <div
      data-fill-bubble
      className="w-full overflow-hidden rounded-xl border border-emerald-500/30 bg-background shadow-sm"
    >
      <div className="flex items-center gap-2.5 bg-emerald-500/[0.06] px-3 py-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
          {receipt.kind === 'scheduled' ? (
            <CalendarClockIcon
              className="size-3.5 text-emerald-700 dark:text-emerald-400"
              strokeWidth={2.6}
            />
          ) : (
            <CheckIcon
              className="size-3.5 text-emerald-700 dark:text-emerald-400"
              strokeWidth={3}
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-700/80 dark:text-emerald-400/80">
            {t('chatBot.checkout.result.confirmed')}
          </p>
          <p className="truncate text-xs font-semibold text-foreground">
            {title}
          </p>
        </div>
      </div>

      <p className="px-3 pt-2 text-[11px] text-muted-foreground">{subtitle}</p>

      <ul className="divide-y divide-border/60 px-3">
        {receipt.items.map(item => {
          const lineTotal = item.price * item.quantity;
          const name = t(item.name, { defaultValue: item.name });
          return (
            <li key={item.id} className="flex items-center gap-2.5 py-2.5">
              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted ring-1 ring-border/60">
                {item.imageSrc ? (
                  <img
                    src={item.imageSrc}
                    alt={item.imageAlt ?? name}
                    className="size-full object-cover"
                  />
                ) : (
                  <ImageIcon className="size-4 text-muted-foreground/50" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium leading-snug text-foreground">
                  {name}
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
            {t('chatBot.checkout.receipt.total')}
          </span>
          <span className="flex items-baseline gap-1">
            <span className="font-mono text-base font-semibold tabular-nums text-foreground">
              {receipt.total.toFixed(2)}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {receipt.currency}
            </span>
          </span>
        </div>
      </div>

      {receipt.transactionId && (
        <TxnRow transactionId={receipt.transactionId} />
      )}
    </div>
  );
}

function TxnRow({ transactionId }: { transactionId: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  return (
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
        {t('chatBot.checkout.receipt.txnId')}
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
  );
}

function FailedReceipt({ receipt }: { receipt: Receipt }) {
  const { t } = useTranslation();
  return (
    <div
      data-fill-bubble
      className="flex w-full items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/[0.06] p-2.5 text-xs"
    >
      <XCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
      <div className="min-w-0">
        <p className="font-medium text-foreground">
          {t('chatBot.checkout.receipt.failedTitle')}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {receipt.error ?? t('chatBot.checkout.receipt.failedSubtitle')}
        </p>
      </div>
    </div>
  );
}
