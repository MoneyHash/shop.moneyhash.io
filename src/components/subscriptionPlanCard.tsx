import { useState } from 'react';
import { SubscriptionPlan } from '@moneyhash/js-sdk';
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
              Subscribed
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
            / {formatRecurrency(plan)}
          </span>
        </div>

        {/* Billing Details - Compact Row */}
        <div className="flex flex-wrap gap-2 text-xs">
          {plan.recurringCycles && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/50 text-foreground">
              {plan.recurringCycles} cycles
            </span>
          )}

          {plan.oneTimeFee && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/50 text-foreground">
              {formatCurrency({
                amount: plan.oneTimeFee,
                currency: plan.currency,
              })}{' '}
              setup fee
            </span>
          )}

          {plan.trialPeriod && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-500/10 text-green-700 dark:text-green-400">
              {plan.trialPeriod} days trial
            </span>
          )}

          {(plan.discountAmount || plan.discountPercentage) && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-orange-500/10 text-orange-700 dark:text-orange-400">
              {plan.discountPercentage
                ? `${plan.discountPercentage}% off`
                : `${formatCurrency({
                    amount: plan.discountAmount!,
                    currency: plan.currency,
                  })} off`}
              {plan.discountCycles && ` (${plan.discountCycles} cycles)`}
            </span>
          )}
        </div>
      </CardContent>

      {(onSubscribe || onReset) && (
        <CardFooter>
          {onReset ? (
            <Button variant="outline" className="w-full" onClick={onReset}>
              ← Back to Plans
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
              {plan.alreadySubscribed ? 'Already Subscribed' : 'Subscribe Now'}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

const formatRecurrency = (plan: SubscriptionPlan) => {
  const unitMap: Record<string, string> = {
    DAY: 'day',
    MONTH: 'month',
  };
  const unit =
    unitMap[plan.recurrencyUnit] || plan.recurrencyUnit.toLowerCase();
  const pluralUnit = plan.recurrency > 1 ? `${plan.recurrency} ${unit}s` : unit;
  return `Every ${pluralUnit}`;
};
