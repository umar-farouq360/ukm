import { useEffect, useId, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Award, BookMarked, BookOpen, CheckCircle2, Clock, GraduationCap, Library, Lock, User } from 'lucide-react'
import { allLessons, categoryById, instructorById, naira, type Course, type CategoryId } from '../data'
import { courseDone, useApp, type Progress } from '../store'

const base = 'inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
export const btnPrimary = `${base} bg-brand text-on-brand hover:bg-brand-hover`
export const btnSecondary = `${base} border border-control bg-surface text-fg hover:bg-subtle`
export const btnGhost = `${base} text-fg2 hover:bg-subtle`
export const card = 'rounded-2xl border border-soft bg-surface'

export const CATEGORY_ICON: Record<CategoryId, typeof Award> = {
  undergraduate: GraduationCap,
  masters: BookMarked,
  postgraduate: Library,
  certificate: Award,
}

/** Sets the document title and moves focus to the page heading on route change (screen-reader friendly). */
export function PageTitle({ title, children, className = '' }: { title: string; children?: ReactNode; className?: string }) {
  useEffect(() => {
    document.title = `${title} | UKM University`
    const h = document.getElementById('page-title')
    h?.focus({ preventScroll: true })
  }, [title])
  return (
    <h1 id="page-title" tabIndex={-1} className={`text-[28px] leading-9 md:text-[32px] md:leading-10 font-bold outline-none ${className}`}>
      {children ?? title}
    </h1>
  )
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'brand' | 'warn' }) {
  const t = tone === 'brand' ? 'bg-selected text-link border-line' : tone === 'warn' ? 'bg-warn text-warn-fg border-transparent' : 'bg-subtle text-fg2 border-soft'
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${t}`}>{children}</span>
}

/** Progress is always shown as a bar AND text, never colour alone. */
export function ProgressBar({ done, total, label }: { done: number; total: number; label: string }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs font-semibold text-fg2 mb-1.5">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={label} className="h-2.5 rounded-full bg-subtle border border-soft overflow-hidden">
        <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function courseProgress(course: Course, p?: Progress) {
  const lessons = allLessons(course)
  const done = p ? lessons.filter((l) => p.lessons.includes(l.id)).length : 0
  const mods = course.modules.filter((m) => p && m.lessons.every((l) => p.lessons.includes(l.id))).length
  return { done, total: lessons.length, modulesDone: mods, modulesTotal: course.modules.length, complete: courseDone(course, p) }
}

export function CourseTile({ course, size = 'md' }: { course: Course; size?: 'md' | 'lg' }) {
  const Icon = CATEGORY_ICON[course.category]
  return (
    <div className={`${size === 'lg' ? 'h-32' : 'h-20'} rounded-xl bg-mint text-link flex items-center justify-between px-4`} aria-hidden="true">
      <Icon size={size === 'lg' ? 40 : 28} />
      <span className="font-bold tracking-wide text-sm">{course.code}</span>
    </div>
  )
}

export function CourseCard({ course }: { course: Course }) {
  const { progress } = useApp()
  const p = progress[course.id]
  const cat = categoryById(course.category)
  const inst = instructorById(course.instructorId)
  const cp = courseProgress(course, p)
  const status = p ? (cp.complete ? 'Completed' : p.status === 'allocated' && p.lessons.length === 0 ? 'Allocated' : 'Enrolled') : !course.open ? 'Intake closed' : null
  return (
    <article className={`${card} p-4 flex flex-col gap-3 h-full`}>
      <CourseTile course={course} />
      <div className="flex flex-wrap gap-1.5">
        <Badge tone="brand">{cat.short}</Badge>
        {status && <Badge tone={status === 'Intake closed' ? 'warn' : 'brand'}>{status === 'Completed' && <CheckCircle2 size={12} aria-hidden="true" />}{status}</Badge>}
      </div>
      <div>
        <h3 className="text-lg font-semibold leading-6">
          <Link to={`/courses/${course.id}`} className="hover:underline after:absolute after:inset-0 after:content-['']">{course.title}</Link>
        </h3>
        <p className="text-xs text-muted mt-0.5">{course.code} · {course.subject}</p>
      </div>
      <p className="text-fg2 line-clamp-2">{course.summary}</p>
      <dl className="mt-auto grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-fg2">
        <div className="flex items-center gap-1.5 col-span-2"><User size={14} aria-hidden="true" /><dt className="sr-only">Instructor</dt><dd>{inst.name}</dd></div>
        <div className="flex items-center gap-1.5"><Clock size={14} aria-hidden="true" /><dt className="sr-only">Duration</dt><dd>{course.weeks} weeks</dd></div>
        <div className="flex items-center gap-1.5"><BookOpen size={14} aria-hidden="true" /><dt className="sr-only">Difficulty</dt><dd>{course.difficulty}</dd></div>
      </dl>
      <div className="flex items-center justify-between pt-3 border-t border-soft">
        <span className="font-bold">{naira(course.price)}</span>
        <span className="text-sm font-semibold text-link">{p ? (cp.complete ? 'View course' : 'Continue') : course.open ? 'View details' : 'Details'}</span>
      </div>
    </article>
  )
}

export function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }) => ReactNode }) {
  const id = useId()
  const desc = [hint ? `${id}-h` : '', error ? `${id}-e` : ''].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold mb-1.5">{label}</label>
      {children({ id, 'aria-describedby': desc, 'aria-invalid': error ? true : undefined })}
      {hint && <p id={`${id}-h`} className="text-xs text-muted mt-1">{hint}</p>}
      {error && <p id={`${id}-e`} role="alert" className="text-xs font-semibold text-danger mt-1">{error}</p>}
    </div>
  )
}
export const inputCls = 'w-full min-h-11 rounded-lg border border-control bg-surface px-3 text-fg placeholder:text-muted'

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' | 'error' }) {
  const t = tone === 'error' ? 'bg-danger-bg text-danger border-transparent' : tone === 'warn' ? 'bg-warn text-warn-fg border-transparent' : 'bg-selected text-fg border-line'
  return <div role={tone === 'error' ? 'alert' : 'note'} className={`rounded-xl border px-4 py-3 text-sm ${t}`}>{children}</div>
}

export function LockedNote({ text }: { text: string }) {
  return <p className="flex items-center gap-2 text-xs text-muted"><Lock size={14} aria-hidden="true" />{text}</p>
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return <div role="status" className="flex items-center gap-2 text-fg2 py-10 justify-center"><span className="size-4 rounded-full border-2 border-line border-t-brand animate-spin" aria-hidden="true" />{label}…</div>
}
