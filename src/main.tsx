/* eslint-disable */
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { IntentStateDetails } from '@moneyhash/js-sdk';
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
  const moneyHash = useMoneyHash({
    onComplete: data => {
      console.log('Complete', data);
    },
    onFail: data => {
      console.log('Fail', data);
    },
  });

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
          const { stateDetails } = await moneyHash.getIntentDetails(intentId);
          moneyHash.renderUrl({
            intentId,
            url: (stateDetails as IntentStateDetails<'URL_TO_RENDER'>)?.url,
            renderStrategy: 'POPUP_IFRAME',
          });
        }}
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
