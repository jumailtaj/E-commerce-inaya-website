import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
  </div>
);

const lazyImport = (importFunc, exportName) => lazy(() => 
  importFunc().then(module => ({ default: module[exportName] }))
);

const HomePage = lazyImport(() => import('./pages/HomePage'), 'HomePage');
const ProductDetailPage = lazyImport(() => import('./pages/ProductDetailPage'), 'ProductDetailPage');
const CartPage = lazyImport(() => import('./pages/CartPage'), 'CartPage');
const ProfilePage = lazyImport(() => import('./pages/ProfilePage'), 'ProfilePage');
const AdminPage = lazyImport(() => import('./pages/AdminPage'), 'AdminPage');
const AdminLoginPage = lazyImport(() => import('./pages/AdminLoginPage'), 'AdminLoginPage');
const LoginPage = lazyImport(() => import('./pages/LoginPage'), 'LoginPage');
const SignupPage = lazyImport(() => import('./pages/SignupPage'), 'SignupPage');
const CheckoutPage = lazyImport(() => import('./pages/CheckoutPage'), 'CheckoutPage');
const OrderHistoryPage = lazyImport(() => import('./pages/OrderHistoryPage'), 'OrderHistoryPage');
const PrivacyPolicy = lazyImport(() => import('./pages/PrivacyPolicy'), 'PrivacyPolicy');
const TermsAndConditions = lazyImport(() => import('./pages/TermsAndConditions'), 'TermsAndConditions');
const RefundPolicy = lazyImport(() => import('./pages/RefundPolicy'), 'RefundPolicy');
const ShippingPolicy = lazyImport(() => import('./pages/ShippingPolicy'), 'ShippingPolicy');

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: 'product/:id', element: withSuspense(ProductDetailPage) },
      { path: 'cart', element: withSuspense(CartPage) },
      { path: 'privacy-policy', element: withSuspense(PrivacyPolicy) },
      { path: 'terms-and-conditions', element: withSuspense(TermsAndConditions) },
      { path: 'refund-policy', element: withSuspense(RefundPolicy) },
      { path: 'shipping-policy', element: withSuspense(ShippingPolicy) },
      { 
        element: <ProtectedRoute />,
        children: [
          { path: 'profile', element: withSuspense(ProfilePage) },
          { path: 'checkout', element: withSuspense(CheckoutPage) },
          { path: 'orders', element: withSuspense(OrderHistoryPage) },
        ]
      },
      {
        element: <AdminRoute />,
        children: [
          { path: 'admin', element: withSuspense(AdminPage) },
        ]
      },
      { path: 'admin/login', element: withSuspense(AdminLoginPage) },
      { path: 'login', element: withSuspense(LoginPage) },
      { path: 'signup', element: withSuspense(SignupPage) },
    ],
  },
]);
