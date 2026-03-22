import { Navigate, Outlet } from 'react-router';

export function AdminRoute() {
  const isAdminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
