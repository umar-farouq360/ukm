import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Award, BookOpen, LayoutDashboard, LogOut, Menu, Moon, Sun, WifiOff, X } from 'lucide-react'
import { CATEGORIES } from '../data'
import { useApp } from '../store'
import { btnGhost, btnPrimary, btnSecondary } from './ui'

const Assistant = lazy(() => import('./Assistant'))

const navCls = ({ isActive }: { isActive: boolean }) =>
  `pressable min-h-11 inline-flex items-center border-b-2 px-3 text-sm font-semibold ${isActive ? 'border-brand text-link' : 'border-transparent text-fg2 hover:text-fg'}`

function Logo() {
  return (
    <Link to="/" className="pressable flex min-h-11 items-center gap-2.5 font-semibold" aria-label="UKM University home">
      <span className="grid size-9 place-items-center border border-brand bg-selected font-display text-xl text-link" aria-hidden="true">U</span>
      <span className="text-[15px] tracking-[-.02em]">UKM <span className="font-normal text-fg2">University</span></span>
    </Link>
  )
}

export default function Layout() {
  const { user, theme, toggleTheme, lowData, toggleLowData, signOut } = useApp()
  const [menu, setMenu] = useState(false)
  const [assistantLoaded, setAssistantLoaded] = useState(false)
  const loc = useLocation()
  const nav = useNavigate()

  useEffect(() => { setMenu(false); window.scrollTo(0, 0) }, [loc.pathname])
  useEffect(() => {
    const activate = () => setAssistantLoaded(true)
    window.addEventListener('ukm:assistant', activate)
    return () => window.removeEventListener('ukm:assistant', activate)
  }, [])

  const out = () => { signOut(); nav('/') }
  const links = (
    <>
      <NavLink to="/" end className={navCls}>Home</NavLink>
      <NavLink to="/courses" className={navCls}>Courses</NavLink>
      {user && <NavLink to="/dashboard" className={navCls}>My learning</NavLink>}
      {user && <NavLink to="/certificates" className={navCls}>Certificates</NavLink>}
    </>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="skip-link">Skip to main content</a>

      <header className="no-print sticky top-0 z-30 border-b border-soft bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-6">
          <Logo />
          <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">{links}</nav>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={toggleLowData} aria-pressed={lowData} title="Low-data mode hides decorative visuals" className={`${btnGhost} px-3 ${lowData ? 'bg-selected text-link' : ''}`}>
              <WifiOff size={18} aria-hidden="true" /><span className="hidden sm:inline">Low-data {lowData ? 'on' : 'off'}</span><span className="sr-only sm:hidden">Low-data mode {lowData ? 'on' : 'off'}</span>
            </button>
            <button onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} className={`${btnGhost} px-3`}>
              {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>
            <div className="hidden lg:flex items-center gap-2 ml-2">
              {user ? (
                <>
                  <span className="text-sm text-fg2 max-w-40 truncate">{user.name}</span>
                  <button onClick={out} className={btnSecondary}><LogOut size={16} aria-hidden="true" />Sign out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className={btnSecondary}>Sign in</Link>
                  <Link to="/register" className={btnPrimary}>Create account</Link>
                </>
              )}
            </div>
            <button onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? 'Close menu' : 'Open menu'} className={`${btnGhost} px-3 lg:hidden`}>
              {menu ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
        {menu && (
          <div id="mobile-menu" className="lg:hidden border-t border-soft bg-surface px-4 py-3">
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {links}
              <p className="text-xs font-semibold text-muted px-3 pt-3">Programmes</p>
              {CATEGORIES.map((c) => (
                <Link key={c.id} to={`/courses?category=${c.id}`} className="px-3 min-h-11 inline-flex items-center rounded-lg text-sm text-fg2 hover:bg-subtle">{c.name}</Link>
              ))}
            </nav>
            <div className="flex gap-2 pt-3">
              {user ? <button onClick={out} className={`${btnSecondary} flex-1`}>Sign out</button> : (
                <>
                  <Link to="/login" className={`${btnSecondary} flex-1`}>Sign in</Link>
                  <Link to="/register" className={`${btnPrimary} flex-1`}>Create account</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main id="main" tabIndex={-1} className={`flex-1 outline-none ${user ? 'pb-20 md:pb-0' : ''}`}>
        <Outlet />
      </main>

      <footer className="no-print mt-16 border-t border-soft bg-surface">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="text-fg2 mt-3 max-w-md">An online learning and skills development platform where learners discover courses, enrol, learn, track progress and earn certificates.</p>
            <p className="text-xs text-muted mt-4 max-w-md">UKM University is a fictional institution created for a design competition. All courses, people and certificates are demonstration data. Payments are simulated and nothing leaves your browser.</p>
          </div>
          <nav aria-label="Programmes">
            <h2 className="text-sm font-bold mb-3">Programmes</h2>
            <ul className="space-y-1">
              {CATEGORIES.map((c) => <li key={c.id}><Link className="text-fg2 hover:underline inline-block py-1" to={`/courses?category=${c.id}`}>{c.name}</Link></li>)}
            </ul>
          </nav>
          <nav aria-label="Platform">
            <h2 className="text-sm font-bold mb-3">Platform</h2>
            <ul className="space-y-1">
              <li><Link className="text-fg2 hover:underline inline-block py-1" to="/courses">All courses</Link></li>
              <li><Link className="text-fg2 hover:underline inline-block py-1" to="/login">Demo login</Link></li>
              <li><Link className="text-fg2 hover:underline inline-block py-1" to="/about-demo">About this demo</Link></li>
            </ul>
          </nav>
        </div>
      </footer>

      {user && (
        <nav aria-label="Learner" className="no-print fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-soft bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
          {[
            { to: '/dashboard', label: 'My learning', Icon: LayoutDashboard },
            { to: '/courses', label: 'Courses', Icon: BookOpen },
            { to: '/certificates', label: 'Certificates', Icon: Award },
          ].map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `pressable flex min-h-14 flex-col items-center justify-center gap-0.5 border-t-2 text-xs font-semibold ${isActive ? 'border-brand text-link' : 'border-transparent text-fg2'}`}>
              <Icon size={20} aria-hidden="true" />{label}
            </NavLink>
          ))}
        </nav>
      )}

      {assistantLoaded && <Suspense fallback={null}><Assistant initiallyOpen /></Suspense>}
    </div>
  )
}
