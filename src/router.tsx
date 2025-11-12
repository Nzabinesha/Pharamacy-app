import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './ui/RootLayout';
import { Home } from './views/Home';
import { Pharmacies } from './views/Pharmacies';
import { PharmacyDetail } from './views/PharmacyDetail';
import { Cart } from './views/Cart';
import { Checkout } from './views/Checkout';
import { Prescription } from './views/Prescription';
import { PharmacyDashboard } from './views/PharmacyDashboard';
import { Notifications } from './views/Notifications';
import { Login } from './views/Login';
import { Signup } from './views/Signup';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'pharmacies', element: <Pharmacies /> },
      { path: 'pharmacies/:id', element: <PharmacyDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'prescription', element: <Prescription /> },
      { path: 'dashboard', element: <PharmacyDashboard /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> }
    ]
  }
]);



