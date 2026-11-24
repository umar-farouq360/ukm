import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Award, BookOpen, GraduationCap, LayoutDashboard } from "lucide-react";
import { CATEGORIES } from "../data";
import { useApp } from "../store";
import Assistant from "./Assistant";
import Header from "./Header";

function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 font-bold text-lg min-h-11"
      aria-label="UKM University home"
    >
      <span
        className="size-9 rounded-lg bg-brand text-on-brand grid place-items-center"
        aria-hidden="true"
      >
        <GraduationCap size={20} />
      </span>
      <span>
        UKM <span className="font-semibold text-fg2">University</span>
      </span>
    </Link>
  );
}

export default function Layout() {
  const { user } = useApp();
  const loc = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);

  const isHome = loc.pathname === "/";
  const isAuth = loc.pathname === "/login" || loc.pathname === "/register";

  // Login and register are full-screen split pages with no site chrome.
  if (isAuth) {
    return (
      <>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <main id="main" tabIndex={-1} className="outline-none">
          <Outlet />
        </main>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {!isHome && <Header />}

      <main
        id="main"
        tabIndex={-1}
        className="flex-1 outline-none pb-20 md:pb-0"
      >
        <Outlet />
      </main>

      <footer className="no-print border-t border-soft bg-surface mt-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="text-fg2 mt-3 max-w-md">
              An online learning and skills development platform where learners
              discover courses, enrol, learn, track progress and earn
              certificates.
            </p>
            <p className="text-xs text-muted mt-4 max-w-md">
              UKM University is a fictional institution created for a design
              competition. All courses, people and certificates are
              demonstration data. Payments are simulated and nothing leaves your
              browser.
            </p>
          </div>
          <nav aria-label="Programmes">
            <h2 className="text-sm font-bold mb-3">Programmes</h2>
            <ul className="space-y-1">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    className="text-fg2 hover:underline inline-block py-1"
                    to={`/courses?category=${c.id}`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Platform">
            <h2 className="text-sm font-bold mb-3">Platform</h2>
            <ul className="space-y-1">
              <li>
                <Link
                  className="text-fg2 hover:underline inline-block py-1"
                  to="/courses"
                >
                  All courses
                </Link>
              </li>
              <li>
                <Link
                  className="text-fg2 hover:underline inline-block py-1"
                  to="/login"
                >
                  Demo login
                </Link>
              </li>
              <li>
                <Link
                  className="text-fg2 hover:underline inline-block py-1"
                  to="/about-demo"
                >
                  About this demo
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>

      {user && (
        <nav
          aria-label="Learner"
          className="no-print md:hidden fixed bottom-0 inset-x-0 z-30 bg-surface border-t border-soft grid grid-cols-3"
        >
          {[
            { to: "/dashboard", label: "My learning", Icon: LayoutDashboard },
            { to: "/courses", label: "Courses", Icon: BookOpen },
            { to: "/certificates", label: "Certificates", Icon: Award },
          ].map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 min-h-14 text-xs font-semibold ${isActive ? "text-link" : "text-fg2"}`
              }
            >
              <Icon size={20} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      )}

      <Assistant />
    </div>
  );
}
