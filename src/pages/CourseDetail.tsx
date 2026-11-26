import { Link, useParams } from 'react-router-dom'
import { BarChart3, CheckCircle2, ChevronRight, Clock, FileText, PlayCircle, Pencil } from 'lucide-react'
import { allLessons, categoryById, courseById, instructorById, naira, type LessonType } from '../data'
import { useApp } from '../store'
import { Badge, CATEGORY_TONE, CourseTile, PageTitle, ProgressBar, btnPrimary, btnSecondary, card, courseProgress, Notice } from '../components/ui'
import NotFound from './NotFound'

const TYPE_ICON: Record<LessonType, typeof FileText> = { reading: FileText, video: PlayCircle, activity: Pencil }
const TYPE_LABEL: Record<LessonType, string> = { reading: 'Reading', video: 'Video', activity: 'Activity' }

export default function CourseDetail() {
  const { id } = useParams()
  const { progress, user } = useApp()
  const course = courseById(id ?? '')
  if (!course) return <NotFound />

  const cat = categoryById(course.category)
  const inst = instructorById(course.instructorId)
  const p = progress[course.id]
  const cp = courseProgress(course, p)
  const lessons = allLessons(course)
  const minutes = lessons.reduce((s, l) => s + l.minutes, 0)

  let cta: React.ReactNode
  if (p && cp.complete) cta = <Link to="/certificates" className={btnPrimary}>View certificate</Link>
  else if (p) cta = <Link to={`/learn/${course.id}`} className={btnPrimary}>{cp.done > 0 ? 'Continue learning' : 'Start learning'}</Link>
  else if (!course.open) cta = <button disabled className={btnPrimary}>Intake closed</button>
  else cta = <Link to={`/enrol/${course.id}`} className={btnPrimary}>{course.price === 0 ? 'Enrol for free' : `Enrol for ${naira(course.price)}`}</Link>

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 md:px-6 md:py-11">
      <nav aria-label="Breadcrumb" className="text-sm text-fg2 flex flex-wrap items-center gap-1 mb-4">
        <Link to="/courses" className="hover:underline">Courses</Link><ChevronRight size={14} aria-hidden="true" />
        <Link to={`/courses?category=${cat.id}`} className="hover:underline">{cat.short}</Link><ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page" className="font-semibold text-fg">{course.code}</span>
      </nav>

      <div className="grid items-start gap-9 lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-14">
        <div className="order-2 space-y-10 lg:order-1 lg:col-start-1">
          <section aria-labelledby="overview">
            <h2 id="overview" className="font-display text-2xl font-medium">Course overview</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-fg2">{course.description}</p>
          </section>

          <section aria-labelledby="learn">
            <h2 id="learn" className="font-display text-2xl font-medium">What you will learn</h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {course.objectives.map((o) => (
                <li key={o} className="flex gap-2.5"><CheckCircle2 size={20} className="shrink-0 text-link mt-0.5" aria-hidden="true" /><span>{o}</span></li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="outline">
            <h2 id="outline" className="font-display text-2xl font-medium">Course outline</h2>
            <p className="text-fg2 mt-1">{course.modules.length} modules, {lessons.length} lessons, about {Math.round(minutes / 60 * 10) / 10} hours of learning.</p>
            <div className="mt-4 space-y-3">
              {course.modules.map((m, i) => (
                <details key={m.id} className={`${card} group`} open={i === 0}>
                  <summary className="pressable flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 p-4 font-semibold marker:hidden">
                    <span>Module {i + 1}: {m.title}</span>
                    <span className="text-xs font-normal text-muted whitespace-nowrap">{m.lessons.length} lessons</span>
                  </summary>
                  <ul className="border-t border-soft divide-y divide-soft">
                    {m.lessons.map((l) => {
                      const Icon = TYPE_ICON[l.type]
                      return (
                        <li key={l.id} className="flex items-center gap-3 px-4 py-3">
                          <Icon size={18} className="text-muted shrink-0" aria-hidden="true" />
                          <span className="flex-1">{l.title}</span>
                          <span className="text-xs text-muted whitespace-nowrap">{TYPE_LABEL[l.type]} · {l.minutes} min</span>
                        </li>
                      )
                    })}
                  </ul>
                </details>
              ))}
            </div>
          </section>

          <section aria-labelledby="inst" className="max-w-3xl">
            <h2 id="inst" className="font-display text-2xl font-medium">Course instructor</h2>
            <div className="mt-4 flex gap-4 border-y border-soft py-5">
              <span className="size-14 shrink-0 rounded-full bg-mint text-link grid place-items-center font-bold text-lg" aria-hidden="true">{inst.name.split(' ').filter((w) => /^[A-Z]/.test(w) && !/\./.test(w))[0]?.[0]}{inst.name.split(' ').at(-1)?.[0]}</span>
              <div>
                <p className="font-semibold">{inst.name}</p>
                <p className="text-sm text-muted">{inst.title}</p>
              <p className="mt-2 leading-relaxed text-fg2">{inst.bio}</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="req" className="grid sm:grid-cols-2 gap-6 max-w-3xl">
            <div>
            <h2 id="req" className="font-display text-xl font-medium">Prerequisites</h2>
              <p className="mt-2 text-fg2">{course.prerequisites}</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-medium">Expected outcomes</h2>
              <ul className="mt-2 list-disc pl-5 text-fg2 space-y-1">{course.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
            </div>
          </section>
        </div>

        <div className="order-1 space-y-4 lg:sticky lg:top-20 lg:col-start-2 lg:row-start-1 lg:order-2">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <Badge tone={CATEGORY_TONE[course.category]}>{cat.short}</Badge>
              <Badge>{course.subject}</Badge>
              {course.level && <Badge>{course.level}</Badge>}
              {!course.open && <Badge tone="warn">Intake closed</Badge>}
            </div>
            <PageTitle title={course.title} className="!text-[28px]">{course.title}</PageTitle>
            <p className="text-sm text-muted mt-1">{course.code}</p>
            <p className="mt-3 leading-relaxed text-fg2">{course.summary}</p>
          </div>

          <div className={`${card} p-5 shadow-soft`}>
            <CourseTile course={course} />
            <p className="mt-4 text-2xl font-semibold tabular-nums">{naira(course.price)}{course.price > 0 && <span className="text-sm font-normal text-muted"> one-off fee</span>}</p>
            {p && <div className="mt-4"><ProgressBar done={cp.done} total={cp.total} label={`${cp.done} of ${cp.total} lessons complete`} /></div>}
            <div className="mt-4">{cta}</div>
            {!user && course.open && <p className="text-xs text-muted">You will be asked to sign in or create an account first.</p>}
            {p?.via === 'allocated' && <p className="text-xs text-muted">This course is allocated to your programme.</p>}
            <dl className="grid grid-cols-2 gap-3 pt-4 border-t border-soft text-sm">
              <div><dt className="text-xs text-muted flex items-center gap-1"><Clock size={13} aria-hidden="true" />Duration</dt><dd className="font-semibold">{course.weeks} weeks</dd></div>
              <div><dt className="text-xs text-muted">Effort</dt><dd className="font-semibold">{course.hoursPerWeek} hrs a week</dd></div>
              <div><dt className="text-xs text-muted flex items-center gap-1"><BarChart3 size={13} aria-hidden="true" />Difficulty</dt><dd className="font-semibold">{course.difficulty}</dd></div>
              <div><dt className="text-xs text-muted">Certificate</dt><dd className="font-semibold">On completion</dd></div>
              <div className="col-span-2"><dt className="text-xs text-muted">Format</dt><dd>{course.format}</dd></div>
            </dl>
          </div>
          {!course.open && <Notice tone="warn">The current intake has closed. Ask the assistant about similar courses that are open now.</Notice>}
          <Link to="/courses" className={`${btnSecondary} w-full`}>Back to all courses</Link>
        </div>
      </div>
    </div>
  )
}
