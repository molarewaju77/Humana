import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LayoutDashboard, FileText, LogOut } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import AdminBreadcrumbs from './AdminBreadcrumbs'
import humanaLogo from '../../assets/humana.png'
import { adminLogout } from '../../lib/auth'
import { cn } from '../../lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Applications', href: '/admin/applications', icon: FileText },
]

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  function handleLogout() {
    adminLogout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-brand-softbg">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Mobile Header Bar (< md) */}
        <header className="sticky top-0 z-30 bg-white border-b border-brand-border px-4 py-3 flex items-center justify-between shadow-xs md:hidden">
          <Link to="/admin/dashboard" className="flex items-center gap-2" aria-label="Humana Admin Portal">
            <img src={humanaLogo} alt="Humana" className="h-6 w-auto object-contain" />
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">
              Admin
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-brand-secondarytext hover:text-brand-error hover:bg-red-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-deeptext hover:bg-brand-softbg rounded-lg transition-colors border border-brand-border/60"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Drawer (< md) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-over panel */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-50 p-5 flex flex-col justify-between animate-slide-in-left">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-brand-border pb-4">
                  <Link to="/" className="flex flex-col gap-1">
                    <img src={humanaLogo} alt="Humana" className="h-7 w-auto object-contain" />
                    <span className="text-[10px] font-semibold text-brand-secondarytext uppercase tracking-wider">Admin Portal</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-brand-secondarytext hover:bg-brand-softbg rounded-lg"
                  >
                    <X size={18} />
                  </button>
                </div>

                <nav className="flex flex-col gap-1.5" aria-label="Mobile Admin navigation">
                  {navItems.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href || pathname.startsWith(href + '/')
                    return (
                      <Link
                        key={href}
                        to={href}
                        className={cn(
                          'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-brand-secondarytext hover:bg-brand-softbg hover:text-brand-deeptext',
                        )}
                      >
                        <Icon size={18} />
                        {label}
                      </Link>
                    )
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-brand-secondarytext hover:bg-red-50 hover:text-brand-error transition-colors w-full"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AdminBreadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
