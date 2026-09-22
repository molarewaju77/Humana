import { useLocation, Link, useParams } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function AdminBreadcrumbs() {
  const { pathname } = useLocation()
  const { id } = useParams<{ id?: string }>()

  // Build breadcrumb items based on current pathname
  const items: { label: string; href?: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
  ]

  if (pathname === '/admin/applications') {
    items.push({ label: 'Applications' })
  } else if (pathname.startsWith('/admin/applications/')) {
    items[0].href = '/admin/dashboard'
    items.push({ label: 'Applications', href: '/admin/applications' })

    if (id) {
      items.push({ label: `App #${id.slice(0, 8)}` })
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-brand-secondarytext mb-4 flex-wrap">
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center gap-1 hover:text-primary transition-colors font-medium text-brand-secondarytext"
      >
        <Home size={13} className="shrink-0 text-brand-secondarytext" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <div key={index} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-brand-border shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-brand-deeptext truncate max-w-[200px]" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-primary transition-colors font-medium text-brand-secondarytext"
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
