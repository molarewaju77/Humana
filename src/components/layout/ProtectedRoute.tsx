import { Navigate, Outlet } from 'react-router-dom'
import { isAdminAuthenticated } from '../../lib/auth'

export default function ProtectedRoute() {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }
  return <Outlet />
}
