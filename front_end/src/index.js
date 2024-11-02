import { lazy, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import nightwind from "nightwind/helper.js"
import './index.css';
import './app.css';
import {
  createHashRouter,
  RouterProvider,
} from 'react-router-dom';

import Page from './page.js'
import Loading from './pages/Loading.js'
import SuspenseWrapper from './components/suspensewrapper.js'

const Home = lazy(() => import("./pages/Home.js"));
const Settings = lazy(() => import("./pages/Settings.js"));
const Recipients = lazy(() => import("./pages/Recipients.js"));
const Orders = lazy(() => import("./pages/Orders.js"));
const OrderDetails = lazy(() => import("./pages/OrderDetails.js"));
const OrderReceipt = lazy(() => import("./pages/OrderReceipt.js"));
const Buy = lazy(() => import("./pages/Buy.js"));
const Sell = lazy(() => import("./pages/Sell.js"));
const Error = lazy(() => import("./pages/Error.js"));
const Logout = lazy(() => import("./pages/Logout.js"));
const Rates = lazy(() => import("./pages/Rates.js"));
const Support = lazy(() => import("./pages/Support.js"));

const router = createHashRouter([
  {
    path: "/",
    element: <SuspenseWrapper fallback={<Loading />}><Page /></SuspenseWrapper>,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/recipients/:page?",
        element: <Recipients />,
      },
      {
        path: "/orders/:page?",
        element: <Orders />,
      },
      {
        path: "/buy/*",
        element: <Buy />,
      },
      {
        path: "/sell/*",
        element: <Sell />,
      },
      {
        path: "/order/:id",
        element: <OrderDetails />,
      },
      {
        path: "/order/:id/receipt",
        element: <OrderReceipt />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
      {
        path: "/rates",
        element: <Rates />,
      },
      {
        path: "/support",
        element: <Support />,
      },
    ]
  }
]);


const root = createRoot(document.getElementById('root'));

function renderApp() {
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );

  const script = document.createElement('script');
  script.textContent = nightwind.init()
  document.head.appendChild(script);
}

requestAnimationFrame(renderApp)