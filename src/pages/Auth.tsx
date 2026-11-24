import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { DEMO_EMAIL, DEMO_PASSWORD, useApp } from '../store'
import { PROGRAMMES } from '../data'
import { Field, PageTitle, btnPrimary, btnSecondary, inputCls } from '../components/ui'

export default function Auth({ mode }: { mode: 'login' | 'register' }) {
  const { user, signIn, register } = useApp()
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const next = sp.get('next') || '/dashboard'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [programme, setProgramme] = useState('none')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (formError || Object.keys(errors).length > 0) errorRef.current?.focus()
  }, [errors, formError])

  if (user) return <Navigate to={next} replace />
  const isLogin = mode === 'login'

  const validate = () => {
    const e: Record<string, string> = {}
    if (!isLogin && name.trim().length < 2) e.name = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Enter a valid email address, for example name@example.com.'
    if (password.length < 8) e.password = 'Password must be at least 8 characters.'
    return e
  }

  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    setFormError('')
    if (Object.keys(e).length) return
    const err = isLogin ? signIn(email, password) : register(name, email, password, programme)
    if (err) { setFormError(err); return }
    nav(next, { replace: true })
  }

  const useDemo = () => {
    const err = signIn(DEMO_EMAIL, DEMO_PASSWORD)
    if (err) setFormError(err)
    else nav(next, { replace: true })
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <PageTitle title={isLogin ? 'Sign in' : 'Create account'}>{isLogin ? 'Sign in' : 'Create your account'}</PageTitle>
      <p className="mt-2 text-fg2">{isLogin ? 'Welcome back. Pick up where you stopped.' : 'Create a demo account to enrol and track your progress.'}</p>

      {isLogin && (
        <div className="mt-6 border-l-4 border-brand bg-selected p-4">
          <p className="font-semibold">Reviewing this demo?</p>
          <p className="text-sm text-fg2 mt-1">Sign in with the sample learner who has a completed course, one in progress and allocated courses.</p>
          <button onClick={useDemo} className={`${btnPrimary} mt-3 w-full`}>Use demo login</button>
          <p className="text-xs text-muted mt-2">Email: {DEMO_EMAIL} · Password: {DEMO_PASSWORD}</p>
        </div>
      )}

      <form onSubmit={submit} noValidate className="mt-7 max-w-md space-y-4 border-t border-soft pt-6">
        {(formError || Object.keys(errors).length > 0) && <div ref={errorRef} tabIndex={-1} role="alert" className="rounded-md border border-danger/40 bg-danger-bg p-3 text-sm text-danger outline-none">
          <p className="font-semibold">{formError || 'Please correct the following fields.'}</p>
          {!formError && <ul className="mt-1 list-inside list-disc">{Object.entries(errors).map(([key, message]) => <li key={key}><a className="underline underline-offset-2" href={`#auth-${key}`}>{message}</a></li>)}</ul>}
        </div>}
        {!isLogin && (
          <Field id="auth-name" label="Full name" error={errors.name}>
            {(p) => <input {...p} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputCls} />}
          </Field>
        )}
        <Field id="auth-email" label="Email" error={errors.email}>
          {(p) => <input {...p} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputCls} />}
        </Field>
        <Field id="auth-password" label="Password" error={errors.password} hint="At least 8 characters.">
          {(p) => <div className="relative"><input {...p} type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isLogin ? 'current-password' : 'new-password'} className={`${inputCls} pr-12`} /><button type="button" onClick={() => setShowPassword((show) => !show)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="pressable absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-md text-fg2 hover:bg-subtle"><span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>{showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}</button></div>}
        </Field>
        {!isLogin && (
        <Field id="auth-programme" label="Your programme" hint="Choosing a programme adds its core courses to your dashboard automatically.">
            {(p) => (
              <select {...p} value={programme} onChange={(e) => setProgramme(e.target.value)} className={inputCls}>
                {PROGRAMMES.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
              </select>
            )}
          </Field>
        )}
        <button type="submit" className={`${btnPrimary} w-full`}>{isLogin ? 'Sign in' : 'Create account'}</button>
        {!isLogin && <p className="text-xs text-muted">Privacy note: this is a demonstration. Your details are kept only in this browser, are never sent anywhere, and your password is not stored. Please use made-up details.</p>}
        {isLogin && <p className="text-xs text-muted">Demo authentication: accounts created in this browser accept any password of 8 or more characters.</p>}
      </form>

      <p className="text-center mt-5 text-fg2">
        {isLogin ? 'New to UKM?' : 'Already have an account?'}{' '}
        <Link to={`${isLogin ? '/register' : '/login'}${sp.get('next') ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-semibold text-link underline underline-offset-2">{isLogin ? 'Create an account' : 'Sign in'}</Link>
      </p>
      <p className="text-center mt-3"><Link to="/courses" className={btnSecondary}>Continue browsing courses</Link></p>
    </div>
  )
}
