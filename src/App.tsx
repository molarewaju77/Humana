import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import ScrollToTop from "./components/layout/ScrollToTop";
import SiteLayout from "./components/layout/SiteLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ApplyPage from "./pages/ApplyPage";
import BenefitsPage from "./pages/BenefitsPage";
import AboutPage from "./pages/AboutPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminApplicationsPage from "./pages/admin/AdminApplicationsPage";
import AdminApplicationDetailPage from "./pages/admin/AdminApplicationDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/benefits" element={<BenefitsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/apply" element={<ApplyPage />} />
          </Route>

          {/* Admin auth */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />

          {/* Protected admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route
                path="/admin/applications"
                element={<AdminApplicationsPage />}
              />
              <Route
                path="/admin/applications/:id"
                element={<AdminApplicationDetailPage />}
              />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
