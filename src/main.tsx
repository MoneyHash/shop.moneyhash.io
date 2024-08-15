import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';

import Home from './pages/home';
import Checkout from './pages/checkout';
import Order from './pages/order';
import IntegrationGuide from './pages/integrationGuide';

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
