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

export default function Playground({
  nativePayData,
  intentId,
}: {
  nativePayData: any;
  intentId: string;
}) {
  const applePayClick = () => {
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
        .then(merchantSession =>
          session.completeMerchantValidation(merchantSession),
        )
        .catch(() => {
          session.completeMerchantValidation({});
        });

    session.onpaymentauthorized = async e => {
      const applePayReceipt = {
        receipt: JSON.stringify({ token: e.payment.token }),
        receiptBillingData: {
          email: e.payment.shippingContact?.emailAddress,
        },
      };
      session.completePayment(ApplePaySession.STATUS_SUCCESS);

      await moneyHash.proceedWith({
        type: 'method',
        id: 'APPLE_PAY',
        intentId,
      });

      const intentDetails = await moneyHash.submitPaymentReceipt({
        nativeReceiptData: applePayReceipt,
        intentId,
      });
      // eslint-disable-next-line no-console
      console.log({ intentDetails });
    };

    session.oncancel = () => {
      // eslint-disable-next-line no-console
      console.log('ApplePay Sheet was closed');
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
