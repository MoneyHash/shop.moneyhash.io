import { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import Home from '@/pages/home';
import IntegrationGuide from '@/pages/integrationGuide';
import GooglePay from '@/pages/google-pay';

const Checkout = lazy(() => import('@/pages/checkout'));
const Order = lazy(() => import('@/pages/order'));
const ApplePay = lazy(() => import('@/pages/apple-pay'));

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
        path: '/apple-pay',
        element: <ApplePay />,
      },
      {
        path: '/google-pay',
        element: <GooglePay />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);
