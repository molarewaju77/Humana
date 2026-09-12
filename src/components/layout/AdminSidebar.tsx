import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, LogOut } from 'lucide-react'
import { adminLogout } from '../../lib/auth'
import { cn } from '../../lib/utils'
import humanaLogo from '../../assets/humana.png'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Applications', href: '/admin/applications', icon: FileText },
]

export default function AdminSidebar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    adminLogout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <aside className="w-60 shrink-0 hidden md:flex flex-col bg-white border-r border-brand-border min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-brand-border">
        <Link to="/" className="flex flex-col gap-1.5" aria-label="Humana Home">
          <img src={humanaLogo} alt="Humana" className="h-7 w-auto object-contain self-start" />
          <span className="text-[10px] font-semibold text-brand-secondarytext uppercase tracking-wider">Admin Portal</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1" aria-label="Admin navigation">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-brand-secondarytext hover:bg-muted hover:text-brand-deeptext',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-5 border-t border-brand-border">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-secondarytext hover:bg-red-50 hover:text-brand-error transition-all duration-200 w-full"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
