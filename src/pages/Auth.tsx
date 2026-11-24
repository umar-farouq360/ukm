import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, GraduationCap, Lock, Mail, User } from "lucide-react";
import { DEMO_EMAIL, DEMO_PASSWORD, useApp } from "../store";
import { PROGRAMMES } from "../data";
import { authCopy } from "../data/auth";
import { siteDetails } from "../data/siteDetails";
import { PageTitle } from "../components/ui";
import AuthShell from "../components/Auth/AuthShell";
import AuthField, { authFieldCls } from "../components/Auth/AuthField";

export default function Auth({ mode }: { mode: "login" | "register" }) {
  const { user, signIn, register } = useApp();
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const next = sp.get("next") || "/dashboard";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [programme, setProgramme] = useState("none");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [forgot, setForgot] = useState(false);

  if (user) return <Navigate to={next} replace />;
  const isLogin = mode === "login";
  const copy = authCopy[mode];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!isLogin && name.trim().length < 2) e.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      e.email = "Enter a valid email address, for example name@example.com.";
    if (password.length < 8)
      e.password = "Password must be at least 8 characters.";
    return e;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setFormError("");
    if (Object.keys(e).length) return;
    const err = isLogin
      ? signIn(email, password)
      : register(name, email, password, programme);
    if (err) {
      setFormError(err);
      return;
    }
    nav(next, { replace: true });
  };

  const useDemo = () => {
    const err = signIn(DEMO_EMAIL, DEMO_PASSWORD);
    if (err) setFormError(err);
    else nav(next, { replace: true });
  };

  const swapTo = `${isLogin ? "/register" : "/login"}${sp.get("next") ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <AuthShell>
      <div className="relative flex flex-col items-center justify-center px-6 py-20">
        <Link
          to="/"
          className="absolute left-5 top-5 inline-flex items-center gap-1.5 min-h-11 px-1 text-[13px] text-au-muted hover:text-au-ink"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to home
        </Link>

        <div className="w-full max-w-[310px]">
          <div className="text-center">
            <p className="text-sm text-au-muted">{copy.kicker}</p>
            <PageTitle
              title={copy.title}
              className="!text-xl !leading-7 !font-bold tracking-tight"
            >
              {siteDetails.siteName}
            </PageTitle>
          </div>

          {isLogin && (
            <>
              <button
                type="button"
                onClick={useDemo}
                className="mt-5 w-full h-[43px] rounded-md bg-au-dark text-au-on-dark text-sm font-medium inline-flex items-center justify-center gap-2.5 shadow-sm hover:opacity-90 transition-opacity"
              >
                <GraduationCap size={18} aria-hidden="true" />
                Use demo login
              </button>
              <div
                className="flex items-center gap-3 my-5 text-xs text-au-muted"
                aria-hidden="true"
              >
                <span className="h-px flex-1 bg-au-line" />
                or
                <span className="h-px flex-1 bg-au-line" />
              </div>
            </>
          )}

          <form
            onSubmit={submit}
            noValidate
            className={`space-y-2.5 ${isLogin ? "" : "mt-6"}`}
          >
            {formError && (
              <p
                role="alert"
                className="rounded-md bg-danger-bg text-danger text-[13px] font-semibold px-3 py-2"
              >
                {formError}
              </p>
            )}
            {!isLogin && (
              <AuthField
                label="Full name"
                error={errors.name}
                icon={<User size={16} />}
              >
                {(p) => (
                  <input
                    {...p}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Your Name"
                    className={authFieldCls}
                  />
                )}
              </AuthField>
            )}
            <AuthField
              label="Email"
              error={errors.email}
              icon={<Mail size={16} />}
            >
              {(p) => (
                <input
                  {...p}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="Your Email"
                  className={authFieldCls}
                />
              )}
            </AuthField>
            <AuthField
              label="Password"
              error={errors.password}
              icon={<Lock size={16} />}
            >
              {(p) => (
                <input
                  {...p}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  placeholder="Your Password"
                  className={authFieldCls}
                />
              )}
            </AuthField>
            {!isLogin && (
              <AuthField
                label="Your programme"
                icon={<GraduationCap size={16} />}
              >
                {(p) => (
                  <select
                    {...p}
                    value={programme}
                    onChange={(e) => setProgramme(e.target.value)}
                    className={`${authFieldCls} appearance-none`}
                  >
                    {PROGRAMMES.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.label}
                      </option>
                    ))}
                  </select>
                )}
              </AuthField>
            )}
            <button
              type="submit"
              className="!mt-4 w-full h-[43px] rounded-md border border-au-line bg-au-btn text-au-ink text-sm font-medium shadow-sm hover:brightness-95 transition"
            >
              {copy.submit}
            </button>
          </form>

          <div className="mt-5 text-center text-[13px] space-y-2.5">
            {isLogin && (
              <>
                <button
                  type="button"
                  onClick={() => setForgot((f) => !f)}
                  aria-expanded={forgot}
                  className="font-medium min-h-8"
                >
                  Forgot password?
                </button>
                {forgot && (
                  <p className="text-xs text-au-muted">
                    Password reset is not available in this demo. Use the demo
                    login above, or create a new account.
                  </p>
                )}
              </>
            )}
            <p className="text-au-muted">
              {copy.swapPrompt}{" "}
              <Link
                to={swapTo}
                className="font-medium text-au-ink hover:underline underline-offset-2"
              >
                {copy.swapLabel}
              </Link>
            </p>
          </div>
        </div>

        <p className="absolute inset-x-6 bottom-4 text-center text-[11px] leading-4 text-au-muted">
          {isLogin ? `Demo: ${DEMO_EMAIL} · ${DEMO_PASSWORD}. ` : ""}
          {copy.note}
        </p>
      </div>
    </AuthShell>
  );
}
