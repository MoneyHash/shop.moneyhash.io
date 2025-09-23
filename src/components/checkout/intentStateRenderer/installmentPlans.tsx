import type { IntentDetails } from '@moneyhash/js-sdk/headless';
import { type InstallmentPlan } from '@moneyhash/js-sdk';
import toast from 'react-hot-toast';
import { moneyHash } from '@/utils/moneyHash';
import { InstallmentPlansListing } from '../installmentPlansListing';
import { logJSON } from '@/utils/logJSON';

export function InstallmentPlans({
  intentId,
  onIntentDetailsChange,
  plans,
}: {
  intentId: string;
  onIntentDetailsChange: (intentDetails: IntentDetails<'payment'>) => void;
  plans: InstallmentPlan[];
}) {
  return (
    <div className="p-4">
      <InstallmentPlansListing
        plans={plans}
        onContinuePayment={async installmentPlan => {
          try {
            const intentDetails = await moneyHash.selectInstallmentPlan({
              intentId,
              planId: installmentPlan.id,
              issuerCode: installmentPlan.issuerCode,
            });
            logJSON.response('proceedWith:savedCard', intentDetails);
            onIntentDetailsChange(intentDetails);
          } catch (error: any) {
            logJSON.error('selectInstallmentPlan', error);
            toast.error(error.message || 'Something went wrong');
          }
        }}
      />
    </div>
  );
}
