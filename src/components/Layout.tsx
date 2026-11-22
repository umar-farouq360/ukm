import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Award, BookOpen, GraduationCap, LayoutDashboard, LogOut, Menu, Moon, Sun, WifiOff, X } from 'lucide-react'
import { CATEGORIES } from '../data'
import { useApp } from '../store'
import Assistant from './Assistant'
import { btnGhost, btnPrimary, btnSecondary } from './ui'

const navCls = ({ isActive }: { isActive: boolean }) =>
  `px-3 min-h-11 inline-flex items-center rounded-lg text-sm font-semibold ${isActive ? 'bg-selected text-link' : 'text-fg2 hover:bg-subtle'}`

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-bold text-lg min-h-11" aria-label="UKM University home">
      <span className="size-9 rounded-lg bg-brand text-on-brand grid place-items-center" aria-hidden="true"><GraduationCap size={20} /></span>
      <span>UKM <span className="font-semibold text-fg2">University</span></span>
    </Link>
  )
}

export default function Layout() {
  const { user, theme, toggleTheme, lowData, toggleLowData, signOut } = useApp()
  const [menu, setMenu] = useState(false)
  const loc = useLocation()
  const nav = useNavigate()

  useEffect(() => { setMenu(false); window.scrollTo(0, 0) }, [loc.pathname])

  const out = () => { signOut(); nav('/') }
  const inLesson = loc.pathname.startsWith('/learn/')

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

      <header className="no-print sticky top-0 z-30 bg-surface border-b border-soft">
        <div className="mx-auto max-w-7xl px-4 md:px-6 flex items-center gap-3 h-16">
          <Logo />
          <nav aria-label="Main" className="hidden lg:flex items-center gap-1 ml-4">{links}</nav>
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
          <div id="mobile-menu" className="lg:hidden border-t border-soft px-4 py-3 flex flex-col gap-1 bg-surface">
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

      <main id="main" tabIndex={-1} className="flex-1 outline-none pb-20 md:pb-0">
        <Outlet />
      </main>

      <footer className="no-print border-t border-soft bg-surface mt-16">
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
