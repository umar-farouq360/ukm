import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { DEMO_EMAIL, DEMO_PASSWORD, useApp } from '../store'
import { PROGRAMMES } from '../data'
import { Field, Notice, PageTitle, btnPrimary, btnSecondary, card, inputCls } from '../components/ui'

export default function Auth({ mode }: { mode: 'login' | 'register' }) {
  const { user, signIn, register } = useApp()
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const next = sp.get('next') || '/dashboard'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [programme, setProgramme] = useState('none')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')

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
      <p className="text-fg2 mt-1">{isLogin ? 'Welcome back. Pick up where you stopped.' : 'Create a free account to enrol and track your progress.'}</p>

      {isLogin && (
        <div className={`${card} p-4 mt-5 bg-selected`}>
          <p className="font-semibold">Reviewing this demo?</p>
          <p className="text-sm text-fg2 mt-1">Sign in with the sample learner who has a completed course, one in progress and allocated courses.</p>
          <button onClick={useDemo} className={`${btnPrimary} mt-3 w-full`}>Use demo login</button>
          <p className="text-xs text-muted mt-2">Email: {DEMO_EMAIL} · Password: {DEMO_PASSWORD}</p>
        </div>
      )}

      <form onSubmit={submit} noValidate className={`${card} p-5 mt-5 space-y-4`}>
        {formError && <Notice tone="error">{formError}</Notice>}
        {!isLogin && (
          <Field label="Full name" error={errors.name}>
            {(p) => <input {...p} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputCls} />}
          </Field>
        )}
        <Field label="Email" error={errors.email}>
          {(p) => <input {...p} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputCls} />}
        </Field>
        <Field label="Password" error={errors.password} hint="At least 8 characters.">
          {(p) => <input {...p} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isLogin ? 'current-password' : 'new-password'} className={inputCls} />}
        </Field>
        {!isLogin && (
          <Field label="Your programme" hint="Choosing a programme adds its core courses to your dashboard automatically.">
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
