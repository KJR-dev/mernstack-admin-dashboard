import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './layouts/Dashboard';
import NonAuth from './layouts/NonAuth';
import Root from './layouts/Root';
import HomePage from './pages/HomePage';
import LoginPage from './pages/login/login';
import Orders from './pages/order/Orders';
import SingleOrder from './pages/order/SingleOrder';
import Tenants from './pages/tenants/Tenants';
import Users from './pages/users/Users';
import Products from './pages/products/Products';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <Dashboard />,
        children: [
          {
            path: '',
            element: <HomePage />,
          },
          {
            path: 'users',
            element: <Users />,
          },
          {
            path: 'tenants',
            element: <Tenants />,
          },
          {
            path: 'products',
            element: <Products />,
          },
          {
            path: 'orders',
            element: <Orders />,
          },
          {
            path: 'orders/:orderId',
            element: <SingleOrder />,
          },
        ],
      },
      {
        path: 'auth',
        element: <NonAuth />,
        children: [
          {
            path: 'login', // ✅ no leading slash
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);
