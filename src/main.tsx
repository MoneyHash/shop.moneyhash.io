import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import * as Sentry from '@sentry/react';

import App from '@/App';
import '@/index.css';

import Home from '@/pages/home';
import Checkout from '@/pages/checkout';
import Order from '@/pages/order';
import IntegrationGuide from '@/pages/integrationGuide';

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'https://e4bcaf20eb1186e8554b8fb8fc1342af@o4508805545721856.ingest.de.sentry.io/4508805556404304',
  });
}

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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);
