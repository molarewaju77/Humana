import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import Button from '../ui/Button'
import humanaLogo from '../../assets/humana.png'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Benefits', href: '/benefits' },
  { label: 'About', href: '/about' },
  { label: 'Opportunities', href: '/#opportunities' },
]

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-brand-border shadow-card'
          : 'bg-white border-transparent',
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 rounded-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Humana Home"
          >
            <img
              src={humanaLogo}
              alt="Humana"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isInternalRoute = link.href.startsWith('/') && !link.href.includes('#')
              return isInternalRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className={cn(
                    'nav-link text-sm font-medium transition-colors',
                    pathname === link.href ? 'text-primary font-bold' : 'text-brand-secondarytext hover:text-brand-deeptext',
                  )}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="nav-link text-sm font-medium text-brand-secondarytext hover:text-brand-deeptext transition-colors"
                >
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/apply">
              <Button size="md" variant="primary">Apply Now</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden flex items-center justify-center size-10 rounded-lg text-brand-secondarytext hover:bg-muted hover:text-brand-deeptext transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden border-t border-brand-border bg-white overflow-hidden transition-all duration-300',
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
        aria-hidden={!menuOpen}
      >
        <nav className="px-5 py-4 flex flex-col gap-1">
          {navLinks
            .filter((link) => link.label !== 'Opportunities')
            .map((link) => {
            const isInternalRoute = link.href.startsWith('/') && !link.href.includes('#')
            return isInternalRoute ? (
              <Link
                key={link.label}
                to={link.href}
                className={cn(
                  'py-2.5 px-3 text-sm font-medium rounded-lg transition-colors',
                  pathname === link.href ? 'text-primary bg-primary/10 font-bold' : 'text-brand-secondarytext hover:text-brand-deeptext hover:bg-muted',
                )}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="py-2.5 px-3 text-sm font-medium text-brand-secondarytext hover:text-brand-deeptext hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            )
          })}
          <div className="pt-3 mt-2 border-t border-brand-border">
            <Link to="/apply" className="block">
              <Button variant="primary" size="md" className="w-full">
                Apply Now
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
