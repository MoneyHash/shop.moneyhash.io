import { useState } from 'react';
import { Check, CreditCard, Calendar, Zap } from 'lucide-react';
import { InstallmentPlan } from '@moneyhash/js-sdk';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radioGroup';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import useCurrency from '@/store/useCurrency';

interface InstallmentPlanProps {
  plans: InstallmentPlan[];
  onContinuePayment: (plan: InstallmentPlan) => Promise<void>;
}

export function InstallmentPlansListing({
  plans,
  onContinuePayment,
}: InstallmentPlanProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const currency = useCurrency(state => state.currency);

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value);
  };

  const getInstallmentDescription = (period: number, amount: number) => {
    if (period === 0) {
      return 'Pay in full today';
    }
    return `${period} monthly payments of ${amount.toFixed(2)} ${currency}`;
  };

  const getInstallmentIcon = (period: number) => {
    if (period === 0) return <Zap className="h-5 w-5 text-checkout-accent" />;
    if (period <= 3)
      return <CreditCard className="h-5 w-5 text-checkout-accent" />;
    return <Calendar className="h-5 w-5 text-checkout-accent" />;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">
          Choose Your Payment Plan
        </h2>
        <p className="text-muted-foreground">
          Select the payment option that works best for you
        </p>
      </div>

      <RadioGroup
        value={selectedPlan}
        onValueChange={handlePlanChange}
        className="space-y-3"
      >
        {plans.map(plan => (
          <div key={plan.id} className="relative">
            <Label htmlFor={plan.id} className="cursor-pointer block">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <RadioGroupItem
                        value={plan.id}
                        id={plan.id}
                        className="w-5 h-5 border-input data-[state=checked]:border-primary"
                      />
                      {selectedPlan === plan.id && (
                        <Check className="absolute inset-0 w-3 h-3 m-auto text-background" />
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      {getInstallmentIcon(plan.installmentPeriod)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-checkout-text">
                            {plan.installmentPeriod === 0
                              ? 'Full Payment'
                              : `${plan.installmentPeriod} Months`}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {getInstallmentDescription(
                            plan.installmentPeriod,
                            plan.amount.formatted,
                          )}
                        </p>
                        <p className="text-xs text-green-500 mt-1">
                          {Number(plan.interestRate)
                            ? `${Number(plan.interestRate)}% Interest`
                            : 'Interest-free'}
                        </p>

                        {!!Number(plan.upfrontFees) && (
                          <p className="text-xs text-red-500 mt-1">
                            + {Number(plan.upfrontFees)} {currency} upfront fee
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      {plan.amount.formatted.toFixed(2)}{' '}
                      <span className="text-lg text-muted-foreground">
                        {currency}
                      </span>
                    </p>
                    {plan.installmentPeriod > 0 && (
                      <p className="text-xs text-muted-foreground">
                        per payment
                      </p>
                    )}
                  </div>
                </div>

                {selectedPlan === plan.id && (
                  <div className="absolute inset-0 rounded-xl ring-2 ring-ring/70 ring-offset-2 ring-offset-background pointer-events-none" />
                )}
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="pt-4">
        <Button
          className="w-full h-12 text-lg font-semibold"
          disabled={!selectedPlan || isLoading}
          onClick={() => {
            setIsLoading(true);
            onContinuePayment(
              plans.find(plan => plan.id === selectedPlan)!,
            ).finally(() => setIsLoading(false));
          }}
        >
          Continue Payment
        </Button>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        <p>🔒 All transactions are secure and encrypted</p>
      </div>
    </div>
  );
}
