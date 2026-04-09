import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import { HelmetProvider } from 'react-helmet-async';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
