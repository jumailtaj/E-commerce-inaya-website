import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { trackPageView } from '../../utils/metaPixel';

export function Layout() {
  const location = useLocation();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    if (lastTrackedPath.current !== location.pathname) {
      trackPageView();
      lastTrackedPath.current = location.pathname;
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
