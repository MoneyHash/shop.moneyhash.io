import { useState } from 'react';
import { SubscriptionPlan } from '@moneyhash/js-sdk';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import formatCurrency from '@/utils/formatCurrency';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';

export function SubscriptionPlanCard({
  plan,
  onSubscribe,
  onReset,
}: {
  plan: SubscriptionPlan;
  onSubscribe?: (planId: string) => Promise<void>;
  onReset?: () => void;
}) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Card
      key={plan.id}
      className={cn(
        'flex flex-col transition-all hover:shadow-lg',
        plan.alreadySubscribed && 'border-primary',
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
            {plan.description && (
              <CardDescription className="text-sm">
                {plan.description}
              </CardDescription>
            )}
          </div>
          {plan.alreadySubscribed && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {t('subscription.subscribed')}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Main Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">
            {formatCurrency({
              amount: plan.amount,
              currency: plan.currency,
            })}
          </span>
          <span className="text-sm text-muted-foreground">
            / {formatRecurrency(plan, t)}
          </span>
        </div>

        {/* Billing Details - Compact Row */}
        <div className="flex flex-wrap gap-2 text-xs">
          {plan.recurringCycles && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/50 text-foreground">
              {plan.recurringCycles} {t('subscription.cycles')}
            </span>
          )}

          {plan.oneTimeFee && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/50 text-foreground">
              {formatCurrency({
                amount: plan.oneTimeFee,
                currency: plan.currency,
              })}{' '}
              {t('subscription.setupFee')}
            </span>
          )}

          {plan.trialPeriod && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-500/10 text-green-700 dark:text-green-400">
              {plan.trialPeriod} {t('subscription.daysTrial')}
            </span>
          )}

          {(plan.discountAmount || plan.discountPercentage) && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-orange-500/10 text-orange-700 dark:text-orange-400">
              {plan.discountPercentage
                ? `${plan.discountPercentage}% ${t('subscription.off')}`
                : `${formatCurrency({
                    amount: plan.discountAmount!,
                    currency: plan.currency,
                  })} ${t('subscription.off')}`}
              {plan.discountCycles &&
                ` (${plan.discountCycles} ${t('subscription.cycles')})`}
            </span>
          )}
        </div>
      </CardContent>

      {(onSubscribe || onReset) && (
        <CardFooter>
          {onReset ? (
            <Button variant="outline" className="w-full" onClick={onReset}>
              {t('subscription.backToPlans')}
            </Button>
          ) : (
            <Button
              className="w-full"
              disabled={plan.alreadySubscribed || isLoading}
              onClick={() => {
                setIsLoading(true);
                onSubscribe!(plan.id).finally(() => setIsLoading(false));
              }}
            >
              {plan.alreadySubscribed
                ? t('subscription.alreadySubscribed')
                : t('subscription.subscribeNow')}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

const formatRecurrency = (
  plan: SubscriptionPlan,
  t: (key: string) => string,
) => {
  const unitMap: Record<string, string> = {
    DAY: t('subscription.day'),
    MONTH: t('subscription.month'),
  };
  const unit =
    unitMap[plan.recurrencyUnit] || plan.recurrencyUnit.toLowerCase();
  const pluralUnit = plan.recurrency > 1 ? `${plan.recurrency} ${unit}s` : unit;
  return `${t('subscription.every')} ${pluralUnit}`;
};
