import React from 'react';
import { moneyHash } from '@/utils/moneyHash';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'apple-pay-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        buttonstyle?: string;
        type?: string;
        locale?: string;
      };
    }
  }
}

export default function Playground({ nativePayData }: { nativePayData: any }) {
  const applePayClick = () => {
    let isCancelled = false;
    const session = new ApplePaySession(3, {
      countryCode: nativePayData.country_code,
      currencyCode: nativePayData.currency_code,
      supportedNetworks: nativePayData.supported_networks,
      merchantCapabilities: ['supports3DS'],
      total: {
        label: 'Apple Pay',
        type: 'final',
        amount: `${nativePayData.amount}`,
      },
      requiredShippingContactFields: ['email'],
    });

    session.onvalidatemerchant = e =>
      moneyHash
        .validateApplePayMerchantSession({
          methodId: nativePayData.method_id,
          validationUrl: e.validationURL,
        })
        .then((merchantSession: any) => {
          // eslint-disable-next-line no-console
          console.log({ merchantSession });
          if (isCancelled) return;
          session.completeMerchantValidation(merchantSession);
        })
        .catch((error: any) => {
          // eslint-disable-next-line no-alert
          alert(`Error: ${error.message}`);
        });

    session.onpaymentauthorized = e => {
      const nativeReceiptData = {
        receipt: JSON.stringify({ token: e.payment.token }),
        receiptBillingData: {
          email: e.payment.shippingContact?.emailAddress,
        },
      };
      session.completePayment(ApplePaySession.STATUS_SUCCESS);

      // eslint-disable-next-line no-alert
      alert(JSON.stringify(nativeReceiptData, null, 2));
    };

    session.oncancel = () => {
      isCancelled = true;
    };
    session.begin();
  };

  return (
    <button
      type="button"
      onClick={() => {
        applePayClick();
      }}
      className="light text-center w-full py-10"
      style={{ backgroundColor: 'crimson' }}
    >
      Apple Pay
    </button>
  );
}
