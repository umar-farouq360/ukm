import { useEffect, useId, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, BookMarked, BookOpen, CheckCircle2, Clock, GraduationCap, Library, Lock, User } from 'lucide-react'
import { allLessons, categoryById, instructorById, naira, type Course, type CategoryId } from '../data'
import { courseDone, useApp, type Progress } from '../store'

const base = 'btn pressable inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-[var(--radius-control)] text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed'
export const btnPrimary = `${base} bg-brand text-on-brand hover:bg-brand-hover`
export const btnSecondary = `${base} border border-control bg-surface text-fg hover:bg-subtle`
export const btnGhost = `${base} text-fg2 hover:bg-subtle`
export const card = 'rounded-[var(--radius-card)] border border-soft bg-surface'

export const CATEGORY_ICON: Record<CategoryId, typeof Award> = {
  undergraduate: GraduationCap,
  masters: BookMarked,
  postgraduate: Library,
  certificate: Award,
}

/** One stable hue per programme category (four categories, four hues), always paired with a text label. */
export type Tone = 'neutral' | 'brand' | 'warn' | 'iris' | 'azure' | 'amber'
export const CATEGORY_TONE: Record<CategoryId, Tone> = { undergraduate: 'brand', masters: 'iris', postgraduate: 'azure', certificate: 'amber' }
export const CATEGORY_ACCENT: Record<CategoryId, string> = { undergraduate: 'var(--primary)', masters: 'var(--iris)', postgraduate: 'var(--azure)', certificate: 'var(--accent)' }
const TILE_BG: Record<CategoryId, string> = { undergraduate: 'bg-tint-1', masters: 'bg-iris-soft', postgraduate: 'bg-azure-soft', certificate: 'bg-amber-soft' }
const TILE_FG: Record<CategoryId, string> = { undergraduate: 'text-link', masters: 'text-iris', postgraduate: 'text-azure', certificate: 'text-amber-ink' }

/** Course illustrations are lightweight WebP files named after the course id. */
export const courseImage = (id: string) => `${import.meta.env.BASE_URL}images/courses/${id}.webp`

/** Sets the document title and moves focus to the page heading on route change (screen-reader friendly). */
export function PageTitle({ title, children, className = '' }: { title: string; children?: ReactNode; className?: string }) {
  useEffect(() => {
    document.title = `${title} | UKM University`
    const h = document.getElementById('page-title')
    h?.focus({ preventScroll: true })
  }, [title])
  return (
    <h1 id="page-title" tabIndex={-1} className={`font-display text-[32px] leading-[1.08] md:text-[42px] md:leading-[1.08] font-medium tracking-[-.025em] outline-none ${className}`}>
      {children ?? title}
    </h1>
  )
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  const t = {
    brand: 'bg-selected text-link border-line',
    warn: 'bg-warn text-warn-fg border-transparent',
    iris: 'bg-iris-soft text-iris border-transparent',
    azure: 'bg-azure-soft text-azure border-transparent',
    amber: 'bg-amber-soft text-amber-ink border-transparent',
    neutral: 'bg-subtle text-fg2 border-soft',
  }[tone]
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors duration-200 ${t}`}>{children}</span>
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
        <div className="h-full bg-brand transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }}><div className="anim-grow h-full w-full origin-left rounded-full bg-brand" style={{ ["--d" as string]: "150ms" } as CSSProperties} /></div>
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
  const { lowData } = useApp()
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  // Low-data mode skips the illustration entirely; the tinted tile and code still identify the course.
  const showImage = !lowData && !failed
  return (
    <div data-loaded={!showImage || loaded} className={`tile relative overflow-hidden rounded-lg ${TILE_BG[course.category]} ${TILE_FG[course.category]} ${size === 'lg' ? 'aspect-[16/9]' : 'aspect-[16/10]'}`} aria-hidden="true">
      {showImage && (
        <>
          <span className="tile-skeleton" />
          <img
            ref={(el) => { if (el?.complete && el.naturalWidth) setLoaded(true) }}
            src={courseImage(course.id)}
            alt=""
            width={640}
            height={400}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`course-img absolute inset-0 h-full w-full object-cover ${loaded ? 'is-loaded' : ''}`}
          />
        </>
      )}
      {!showImage && <Icon className="absolute right-4 top-4 opacity-30" size={size === 'lg' ? 56 : 44} strokeWidth={1.4} />}
      <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-md border border-soft bg-surface/90 px-2 py-1 font-mono text-[11px] font-semibold tracking-[.1em] text-fg backdrop-blur-sm">
        <Icon size={13} strokeWidth={1.8} className={TILE_FG[course.category]} />{course.code}
      </span>
    </div>
  )
}

/** Wraps matches of the live search terms in <mark>, so people see why a course matched. */
function Highlight({ text, query }: { text: string; query?: string }) {
  const terms = (query ?? '').trim().split(/\s+/).filter(Boolean).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!terms.length) return <>{text}</>
  const parts = text.split(new RegExp(`(${terms.join('|')})`, 'ig'))
  return <>{parts.map((part, i) => (i % 2 ? <mark key={i} className="hit">{part}</mark> : part))}</>
}

export function CourseCard({ course, query }: { course: Course; query?: string }) {
  const { progress } = useApp()
  const p = progress[course.id]
  const cat = categoryById(course.category)
  const inst = instructorById(course.instructorId)
  const cp = courseProgress(course, p)
  const status = p ? (cp.complete ? 'Completed' : p.status === 'allocated' && p.lessons.length === 0 ? 'Allocated' : 'Enrolled') : !course.open ? 'Intake closed' : null
  return (
    <article className={`${card} card-hover p-4 flex flex-col gap-3 h-full`} style={{ ['--card-accent' as string]: CATEGORY_ACCENT[course.category] } as CSSProperties}>
      <CourseTile course={course} />
      <div className="flex flex-wrap gap-1.5">
        <Badge tone={CATEGORY_TONE[course.category]}>{cat.short}</Badge>
        {status && <Badge tone={status === 'Intake closed' ? 'warn' : 'brand'}>{status === 'Completed' && <CheckCircle2 size={12} aria-hidden="true" />}{status}</Badge>}
      </div>
      <div>
        <h3 className="font-display text-[22px] leading-[1.15] font-medium tracking-[-.01em]">
          <Link to={`/courses/${course.id}`} className="card-title after:absolute after:inset-0 after:content-['']"><Highlight text={course.title} query={query} /></Link>
        </h3>
        <p className="text-sm text-muted mt-1">{course.subject}</p>
      </div>
      <p className="text-sm text-fg2 line-clamp-2">{course.summary}</p>
      <dl className="mt-auto grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-fg2">
        <div className="flex items-center gap-1.5 col-span-2"><User size={14} aria-hidden="true" /><dt className="sr-only">Instructor</dt><dd>{inst.name}</dd></div>
        <div className="flex items-center gap-1.5"><Clock size={14} aria-hidden="true" /><dt className="sr-only">Duration</dt><dd>{course.weeks} weeks</dd></div>
        <div className="flex items-center gap-1.5"><BookOpen size={14} aria-hidden="true" /><dt className="sr-only">Difficulty</dt><dd>{course.difficulty}</dd></div>
      </dl>
      <div className="flex items-center justify-between pt-3 border-t border-soft">
        <span className="font-semibold tabular-nums">{naira(course.price)} <span className="font-normal text-xs text-muted">{course.price === 0 ? 'no fee' : ''}</span></span>
        <span className="card-cta inline-flex items-center gap-1.5 text-sm font-semibold text-link">{p ? (cp.complete ? 'View course' : 'Continue') : course.open ? 'Course details' : 'Details'}<ArrowRight size={15} className="card-cta-arrow" aria-hidden="true" /></span>
      </div>
    </article>
  )
}

export function Field({ label, error, hint, id: providedId, children }: { label: string; error?: string; hint?: string; id?: string; children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }) => ReactNode }) {
  const generatedId = useId()
  const id = providedId ?? generatedId
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
export const inputCls = 'w-full min-h-11 rounded-[var(--radius-control)] border border-control bg-surface px-3 text-fg placeholder:text-muted transition-[border-color,box-shadow] duration-200 hover:border-fg2 focus:border-brand'

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' | 'error' }) {
  const t = tone === 'error' ? 'bg-danger-bg text-danger border-transparent' : tone === 'warn' ? 'bg-warn text-warn-fg border-transparent' : 'bg-selected text-fg border-line'
  return <div role={tone === 'error' ? 'alert' : 'note'} className={`anim-pop rounded-xl border px-4 py-3 text-sm ${t}`}>{children}</div>
}

export function LockedNote({ text }: { text: string }) {
  return <p className="flex items-center gap-2 text-xs text-muted"><Lock size={14} aria-hidden="true" />{text}</p>
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return <div role="status" style={{ ['--d' as string]: '180ms' } as CSSProperties} className="anim-pop flex items-center gap-2 text-fg2 py-10 justify-center"><span className="size-4 rounded-full border-2 border-line border-t-brand animate-spin" aria-hidden="true" />{label}…</div>
}
