import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Award, BookOpen, LayoutDashboard } from 'lucide-react'
import { useApp } from '../store'
import Assistant from './Assistant'
import Footer from './Footer'
import Header from './Header'

export default function Layout() {
  const { user } = useApp()
  const loc = useLocation()

  useEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])

  const isHome = loc.pathname === '/'
  const isAuth = loc.pathname === '/login' || loc.pathname === '/register'

  // Login and register are full-screen split pages with no site chrome.
  if (isAuth) {
    return (
      <>
        <a href="#main" className="skip-link">Skip to main content</a>
        <main id="main" tabIndex={-1} className="outline-none"><Outlet /></main>
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="skip-link">Skip to main content</a>

      {!isHome && <Header />}

      <main id="main" tabIndex={-1} className="flex-1 outline-none pb-20 md:pb-0">
        <Outlet />
      </main>

      <Footer />

      {user && (
        <nav aria-label="Learner" className="no-print md:hidden fixed bottom-0 inset-x-0 z-30 bg-surface border-t border-soft grid grid-cols-3">
          {[
            { to: '/dashboard', label: 'My learning', Icon: LayoutDashboard },
            { to: '/courses', label: 'Courses', Icon: BookOpen },
            { to: '/certificates', label: 'Certificates', Icon: Award },
          ].map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center justify-center gap-0.5 min-h-14 text-xs font-semibold ${isActive ? 'text-link' : 'text-fg2'}`}>
              <Icon size={20} aria-hidden="true" />{label}
            </NavLink>
          ))}
        </nav>
      )}

      <Assistant />
    </div>
  )
}
