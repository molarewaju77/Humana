const AUTH_KEY = 'hamana_admin_session'

// Demo credentials — clearly marked, frontend-only demo
const DEMO_EMAIL = 'admin@hamana.com'
const DEMO_PASSWORD = 'Admin2026!'

export function adminLogin(email: string, password: string): boolean {
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify({ email, name: 'Admin User' }))
    return true
  }
  return false
}

export function adminLogout(): void {
  sessionStorage.removeItem(AUTH_KEY)
}

export function getAdminSession(): { email: string; name: string } | null {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null
}
