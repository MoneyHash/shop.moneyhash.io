/* eslint-disable */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';

import Home from './pages/home';
import Checkout from './pages/checkout';
import Order from './pages/order';
import IntegrationGuide from './pages/integrationGuide';
import useMoneyHash from './hooks/useMoneyHash';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
      {
        path: '/checkout/order',
        element: <Order />,
      },
      {
        path: '/integration-guide',
        element: <IntegrationGuide />,
      },
      {
        path: '/playground',
        element: <Playground />,
      },
    ],
  },
]);

function Playground() {
  const [intentId, setIntentId] = useState('');
  const [applePayNativeData, setApplePayNativeData] = useState<any>(null);
  const moneyHash = useMoneyHash({
    onComplete: data => {
      console.log('Complete', data);
    },
    onFail: data => {
      console.log('Fail', data);
    },
  });

  useEffect(() => {
    async function getApplePay() {
      const { expressMethods } = await moneyHash.getMethods({
        currency: 'usd',
        amount: 50,
      });
      const applePayNativeData = expressMethods.find(m => m.id === 'APPLE_PAY')
        ?.nativePayData!;
      console.log({ applePayNativeData });
      setApplePayNativeData(applePayNativeData);
    }

    getApplePay();
  }, []);

  return (
    <div>
      <h1>Playground</h1>
      <input
        type="text"
        name=""
        id=""
        placeholder="Intent ID"
        value={intentId}
        onChange={e => setIntentId(e.target.value)}
      />
      <button
        type="button"
        onClick={async () => {
          const session = new ApplePaySession(3, {
            countryCode: applePayNativeData.country_code,
            currencyCode: applePayNativeData.currency_code,
            supportedNetworks: applePayNativeData.supported_networks,
            merchantCapabilities: applePayNativeData.supported_capabilities,
            total: {
              label: 'Apple Pay',
              type: 'final',
              amount: `${applePayNativeData.amount}`,
            },
            requiredShippingContactFields: ['email'],
          });

          session.onvalidatemerchant = e =>
            moneyHash
              .validateApplePayMerchantSession({
                methodId: applePayNativeData.method_id,
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

            console.log(applePayReceipt);
          };

          session.oncancel = () => {
            console.log('ApplePay Sheet was closed');
          };

          session.begin();
        }}
        disabled={!applePayNativeData}
      >
        Click me
      </button>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
