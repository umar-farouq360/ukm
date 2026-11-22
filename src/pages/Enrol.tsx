import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, CreditCard } from 'lucide-react'
import { categoryById, courseById, naira } from '../data'
import { useApp } from '../store'
import { Field, Notice, PageTitle, btnPrimary, btnSecondary, card, inputCls } from '../components/ui'
import NotFound from './NotFound'

export default function Enrol() {
  const { id } = useParams()
  const { user, progress, enrol } = useApp()
  const nav = useNavigate()
  const course = courseById(id ?? '')
  const [agree, setAgree] = useState(false)
  const [payer, setPayer] = useState(user?.name ?? '')
  const [errors, setErrors] = useState<{ agree?: string; payer?: string }>({})
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)

  if (!course || !user) return <NotFound />
  const existing = progress[course.id]
  const cat = categoryById(course.category)
  const paid = course.price > 0

  if (existing && !done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <PageTitle title="Already enrolled">You are already on this course</PageTitle>
        <p className="mt-2 text-fg2">{course.title} is on your dashboard{existing.via === 'allocated' ? ' because it is allocated to your programme' : ''}.</p>
        <Link to={`/learn/${course.id}`} className={`${btnPrimary} mt-5`}>Go to the course</Link>
      </div>
    )
  }

  if (!course.open) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 space-y-4">
        <PageTitle title="Enrolment unavailable">Enrolment is not available</PageTitle>
        <Notice tone="warn"><AlertTriangle size={16} className="inline mr-1" aria-hidden="true" />The intake for {course.title} has closed. Please choose another course.</Notice>
        <Link to="/courses" className={btnSecondary}>Browse open courses</Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div role="status" className={`${card} p-6 md:p-8 text-center`}>
          <CheckCircle2 size={40} className="mx-auto text-link" aria-hidden="true" />
          <PageTitle title="Enrolment confirmed" className="mt-3">You are enrolled</PageTitle>
          <p className="mt-2 text-fg2">{course.title} is now on your dashboard.{paid ? ' (Demo payment recorded. No real charge was made.)' : ''}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
            <Link to={`/learn/${course.id}`} className={btnPrimary}>Start the first lesson</Link>
            <Link to="/dashboard" className={btnSecondary}>Go to dashboard</Link>
          </div>
        </div>
      </div>
    )
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!agree) next.agree = 'Please confirm you have read the course details.'
    if (paid && payer.trim().length < 2) next.payer = 'Enter the name of the person paying.'
    setErrors(next)
    if (Object.keys(next).length) return
    setProcessing(true)
    window.setTimeout(() => { enrol(course.id); setProcessing(false); setDone(true); window.scrollTo(0, 0) }, 700)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
      <PageTitle title={`Enrol in ${course.title}`}>Enrol in this course</PageTitle>
      <ol className="mt-3 flex flex-wrap gap-x-4 text-sm text-fg2" aria-label="Enrolment steps">
        <li className="text-link font-semibold">1. Review and confirm</li>
        <li>2. {paid ? 'Demo payment' : 'No payment needed'}</li>
        <li>3. Start learning</li>
      </ol>

      <div className="mt-6 grid md:grid-cols-[1fr_320px] gap-6 items-start">
        <form onSubmit={submit} noValidate className={`${card} p-5 space-y-5`}>
          <section aria-labelledby="req">
            <h2 id="req" className="text-lg font-semibold">Requirements check</h2>
            <ul className="mt-2 space-y-2">
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-link shrink-0 mt-0.5" aria-hidden="true" /><span><strong>Intake open.</strong> You can enrol now.</span></li>
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-link shrink-0 mt-0.5" aria-hidden="true" /><span><strong>Prerequisites:</strong> {course.prerequisites}</span></li>
            </ul>
          </section>

          {paid && (
            <section aria-labelledby="pay" className="space-y-3">
              <h2 id="pay" className="text-lg font-semibold flex items-center gap-2"><CreditCard size={18} aria-hidden="true" />Payment</h2>
              <Notice tone="warn"><strong>Demo payment, no real charge.</strong> Do not enter real card details. This demonstration does not collect any.</Notice>
              <Field label="Name of person paying" error={errors.payer}>
                {(p) => <input {...p} value={payer} onChange={(e) => setPayer(e.target.value)} className={inputCls} autoComplete="off" />}
              </Field>
            </section>
          )}

          <div>
            <label className="flex items-start gap-3 min-h-11">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="size-5 mt-0.5 accent-[var(--primary)]" aria-describedby={errors.agree ? 'agree-err' : undefined} />
              <span>I have read the course details{paid ? ` and understand the fee of ${naira(course.price)}` : ''}.</span>
            </label>
            {errors.agree && <p id="agree-err" role="alert" className="text-xs font-semibold text-danger mt-1">{errors.agree}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button type="submit" disabled={processing} className={btnPrimary}>{processing ? 'Processing…' : paid ? `Confirm and pay ${naira(course.price)} (demo)` : 'Confirm enrolment'}</button>
            <Link to={`/courses/${course.id}`} className={btnSecondary}>Cancel</Link>
          </div>
        </form>

        <aside aria-label="Order summary" className={`${card} p-5`}>
          <h2 className="text-lg font-semibold">Summary</h2>
          <p className="mt-2 font-semibold">{course.title}</p>
          <p className="text-sm text-muted">{course.code} · {cat.short}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-fg2">Duration</dt><dd>{course.weeks} weeks</dd></div>
            <div className="flex justify-between"><dt className="text-fg2">Difficulty</dt><dd>{course.difficulty}</dd></div>
            <div className="flex justify-between border-t border-soft pt-2 text-base font-bold"><dt>Total to pay</dt><dd>{naira(course.price)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  )
}
