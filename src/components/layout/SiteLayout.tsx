import { Outlet } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

export default function SiteLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-white w-full overflow-x-hidden">
      <SiteHeader />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
