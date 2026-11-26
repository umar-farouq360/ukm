import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, Moon, Sun, WifiOff, X } from "lucide-react";
import { CATEGORIES } from "../data";
import { siteDetails } from "../data/siteDetails";
import { menuItems } from "../data/menuItems";
import { useApp } from "../store";

const linkCls = ({ isActive }: { isActive: boolean }) =>
  `min-h-11 inline-flex items-center text-[15px] xl:text-base text-hx-ink underline-offset-8 decoration-2 hover:underline ${isActive ? "underline font-semibold" : ""}`;

const iconBtn =
  "size-11 rounded-full grid place-items-center text-hx-ink hover:bg-black/5 dark:hover:bg-white/10 transition-colors";
const pill =
  "min-h-[46px] min-w-[9rem] px-8 rounded-full border border-hx-ink text-[15px] xl:text-base text-hx-ink inline-flex items-center justify-center gap-2 hover:bg-hx-ink hover:text-hx-card transition-colors";

interface Props {
  /** Place the bar inside the home hero card instead of as a sticky page bar. */
  embedded?: boolean;
}

const Header: React.FC<Props> = ({ embedded = false }) => {
  const { user, theme, toggleTheme, lowData, toggleLowData, signOut } =
    useApp();
  const [menu, setMenu] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    setMenu(false);
  }, [loc.pathname]);

  const out = () => {
    signOut();
    nav("/");
  };

  const links = menuItems
    .filter((item) => !item.requiresAuth || user)
    .map((item) => (
      <NavLink key={item.url} to={item.url} end={item.end} className={linkCls}>
        {item.text}
      </NavLink>
    ));

  const wrap = embedded
    ? "relative z-20"
    : "no-print sticky top-0 z-30 bg-hx-card border-b border-soft";
  const inner = embedded
    ? "px-[clamp(1.25rem,4.7vw,4.5rem)] h-[clamp(72px,8vw,120px)]"
    : "mx-auto max-w-7xl px-4 md:px-6 h-[72px]";

  return (
    <header className={wrap}>
      <div className={`flex items-center gap-4 ${inner}`}>
        {/* Logo */}
        <Link
          to="/"
          aria-label={`${siteDetails.siteName} home`}
          className="font-display text-[20px] md:text-[22px] font-bold tracking-tight text-hx-ink min-h-11 inline-flex items-center whitespace-nowrap "
        >
          {siteDetails.siteName}
        </Link>

        {/* Desktop menu */}
        <nav
          aria-label="Main"
          className="hidden lg:flex items-center gap-8 xl:gap-12 ml-6 xl:ml-10"
        >
          {links}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            onClick={toggleLowData}
            aria-pressed={lowData}
            title="Low-data mode hides decorative visuals"
            className={`${iconBtn} ${lowData ? "bg-hx-accent !text-hx-on-accent" : ""}`}
          >
            <WifiOff size={18} aria-hidden="true" />
            <span className="sr-only">
              Low-data mode {lowData ? "on" : "off"}
            </span>
          </button>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className={iconBtn}
          >
            {theme === "dark" ? (
              <Sun size={18} aria-hidden="true" />
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
          </button>

          <div className="hidden lg:flex items-center gap-2 ml-2">
            {user ? (
              <>
                <span className="text-sm text-hx-ink max-w-40 truncate mr-1">
                  {user.name}
                </span>
                <button onClick={out} className={pill}>
                  <LogOut size={16} aria-hidden="true" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="min-h-11 px-4 inline-flex items-center text-[15px] text-hx-ink hover:underline underline-offset-4"
                >
                  Log in
                </Link>
                <Link to="/register" className={pill}>
                  Enroll
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            aria-controls="mobile-menu"
            aria-label={menu ? "Close menu" : "Open menu"}
            className={`${iconBtn} lg:hidden`}
          >
            {menu ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menu && (
        <div
          id="mobile-menu"
          className={`lg:hidden border-t border-black/10 dark:border-white/10 px-5 py-4 flex flex-col gap-1 ${embedded ? "bg-hx-card" : ""}`}
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {links}
            <p className="text-xs font-semibold text-hx-muted pt-4 pb-1">
              Programmes
            </p>
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to={`/courses?category=${c.id}`}
                className="min-h-11 inline-flex items-center text-[15px] text-hx-ink hover:underline underline-offset-4"
              >
                {c.name}
              </Link>
            ))}
          </nav>
          <div className="flex gap-2 pt-4">
            {user ? (
              <button onClick={out} className={`${pill} flex-1 min-w-0`}>
                Sign out
              </button>
            ) : (
              <>
                <Link to="/login" className={`${pill} flex-1 min-w-0`}>
                  Log in
                </Link>
                <Link
                  to="/register"
                  className={`${pill} flex-1 min-w-0 !bg-hx-accent !text-hx-on-accent !border-transparent`}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
