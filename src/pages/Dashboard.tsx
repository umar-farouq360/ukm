import { Link } from 'react-router-dom'
import { Award, Bot, CheckCircle2, Flame, Pencil, RotateCcw } from 'lucide-react'
import { COURSES, PROGRAMMES, allLessons, courseById, instructorById, naira, type Course } from '../data'
import { useApp, type Progress } from '../store'
import { openAssistant } from '../components/assistant-events'
import { Badge, CourseCard, PageTitle, ProgressBar, btnPrimary, btnSecondary, courseProgress } from '../components/ui'

export function nextLessonId(course: Course, p?: Progress) {
  const ls = allLessons(course)
  if (p?.last && !p.lessons.includes(p.last) && ls.some((l) => l.id === p.last)) return p.last
  return (ls.find((l) => !p?.lessons.includes(l.id)) ?? ls[0]).id
}

const fmt = (d?: string) => {
  if (!d) return 'Not started'
  const diff = Math.round((new Date(new Date().toISOString().slice(0, 10)).getTime() - new Date(d).getTime()) / 86400000)
  return diff <= 0 ? 'Today' : diff === 1 ? 'Yesterday' : `${diff} days ago`
}

export default function Dashboard() {
  const { user, progress, achievements, streak, resetDemo } = useApp()
  if (!user) return null
  const entries = Object.entries(progress).map(([id, p]) => ({ course: courseById(id)!, p })).filter((e) => e.course)
  const active = entries.filter((e) => !courseProgress(e.course, e.p).complete)
  const completed = entries.filter((e) => courseProgress(e.course, e.p).complete)
  const recent = [...active].filter((e) => e.p.accessed).sort((a, b) => (b.p.accessed ?? '').localeCompare(a.p.accessed ?? ''))[0] ?? active[0]
  const programme = PROGRAMMES.find((x) => x.id === user.programme)
  const outstanding = active.flatMap(({ course, p }) =>
    allLessons(course).filter((l) => l.type === 'activity' && !p.lessons.includes(l.id)).slice(0, 2).map((l) => ({ course, lesson: l })),
  ).slice(0, 5)
  const subjects = new Set(entries.map((e) => e.course.subject))
  const recs = COURSES.filter((c) => c.open && !progress[c.id])
    .sort((a, b) => Number(subjects.has(b.subject)) - Number(subjects.has(a.subject)) || Number(!!b.popular) - Number(!!a.popular))
    .slice(0, 3)
  const earned = achievements.filter((a) => a.earned)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <header className="border-b border-soft pb-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-[.14em] text-link">Learner dashboard</p>
        <PageTitle title="My learning">Welcome back, {user.name.split(' ')[0]}</PageTitle>
        <p className="mt-2 text-fg2">{programme && programme.id !== 'none' ? `${programme.label}. ` : ''}Pick up where you left off.</p>
      </header>

      {recent ? (
        <section aria-labelledby="continue" className="mt-7 border-l-4 border-brand bg-selected px-5 py-5 md:px-7 md:py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-semibold uppercase tracking-[.12em] text-link">Continue learning</p>
              <h2 id="continue" className="font-display mt-2 text-2xl font-medium md:text-3xl">{recent.course.title}</h2>
              <p className="mt-1 text-sm text-fg2">Next: {allLessons(recent.course).find((l) => l.id === nextLessonId(recent.course, recent.p))?.title} <span className="text-muted">· Last studied {fmt(recent.p.accessed).toLowerCase()}</span></p>
              <div className="mt-4 max-w-lg">
                {(() => { const cp = courseProgress(recent.course, recent.p); return <ProgressBar done={cp.done} total={cp.total} label={`${cp.modulesDone} of ${cp.modulesTotal} modules · ${cp.done} of ${cp.total} lessons`} /> })()}
              </div>
            </div>
            <Link to={`/learn/${recent.course.id}/${nextLessonId(recent.course, recent.p)}`} className={btnPrimary}>{recent.p.lessons.length ? 'Resume lesson' : 'Start learning'}</Link>
          </div>
        </section>
      ) : (
        <section aria-labelledby="continue" className="mt-7 border-l-4 border-brand bg-selected px-5 py-5 md:px-7 md:py-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-[.12em] text-link">Your next step</p>
          <h2 id="continue" className="font-display mt-2 text-2xl font-medium md:text-3xl">Choose a course to begin</h2>
          <p className="mt-1 text-fg2">Explore the catalogue and review the course outline before enrolling.</p>
          <Link to="/courses" className={`${btnPrimary} mt-4`}>Browse courses</Link>
        </section>
      )}

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="mine">
            <div className="flex items-end justify-between gap-3 border-b border-soft pb-3">
              <h2 id="mine" className="font-display text-2xl font-medium">My courses</h2>
              <span className="text-sm text-muted">{active.length} in progress</span>
            </div>
            {active.length === 0 ? <p className="py-5 text-sm text-fg2">Courses you enrol in will appear here.</p> : (
              <ul className="divide-y divide-soft">
                {active.map(({ course, p }) => {
                  const cp = courseProgress(course, p)
                  const state = p.lessons.length === 0 && p.via === 'allocated' ? 'Allocated' : p.lessons.length === 0 ? 'Not started' : 'In progress'
                  return (
                    <li key={course.id} className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap gap-2"><Badge tone="brand">{state}</Badge>{p.via === 'allocated' && <Badge>Programme course</Badge>}</div>
                        <h3 className="font-display text-xl font-medium leading-tight">{course.title}</h3>
                        <p className="mt-1 text-sm text-muted">{course.code} · {instructorById(course.instructorId).name}</p>
                        <div className="mt-3 max-w-lg"><ProgressBar done={cp.done} total={cp.total} label={`${cp.modulesDone} of ${cp.modulesTotal} modules complete`} /></div>
                        <p className="mt-2 text-xs text-muted">Last accessed: {fmt(p.accessed)}</p>
                      </div>
                      <Link to={`/learn/${course.id}/${nextLessonId(course, p)}`} className={btnSecondary}>{cp.done ? 'Continue course' : 'Start course'}</Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          {completed.length > 0 && (
            <section aria-labelledby="done">
              <div className="border-b border-soft pb-3"><h2 id="done" className="font-display text-2xl font-medium">Completed courses</h2></div>
              <ul className="divide-y divide-soft">
                {completed.map(({ course, p }) => (
                  <li key={course.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <div className="flex min-w-0 items-start gap-3"><CheckCircle2 className="mt-1 shrink-0 text-link" size={19} aria-hidden="true" /><div><p className="font-semibold">{course.title}</p><p className="text-sm text-muted">Completed {p.completedOn}</p></div></div>
                    <Link to={`/certificates/${course.id}`} className={btnSecondary}><Award size={16} aria-hidden="true" />View certificate</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="rec">
            <div className="border-b border-soft pb-3"><h2 id="rec" className="font-display text-2xl font-medium">More from the catalogue</h2><p className="mt-1 text-sm text-fg2">Courses related to subjects in your current learning list.</p></div>
            {recs.length ? <ul className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{recs.map((c) => <li key={c.id} className="relative"><CourseCard course={c} /></li>)}</ul> : <p className="py-5 text-sm text-fg2">You have explored every currently open course in this demo catalogue.</p>}
          </section>
        </div>

        <aside className="space-y-8" aria-label="Activity and milestones">
          <section aria-labelledby="todo">
            <div className="border-b border-soft pb-3"><h2 id="todo" className="font-display text-xl font-medium">Practice activities</h2></div>
            {outstanding.length === 0 ? <p className="mt-3 text-sm text-fg2">No activities waiting for you.</p> : (
              <ul className="mt-2 divide-y divide-soft">
                {outstanding.map(({ course, lesson }) => (
                  <li key={lesson.id}><Link to={`/learn/${course.id}/${lesson.id}`} className="pressable flex min-h-14 items-start gap-3 py-3 hover:text-link"><Pencil size={15} className="mt-1 shrink-0 text-muted" aria-hidden="true" /><span><span className="block text-sm font-semibold">{lesson.title}</span><span className="block text-xs text-muted">{course.code} · about {lesson.minutes} min</span></span></Link></li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="ach">
            <div className="border-b border-soft pb-3"><h2 id="ach" className="font-display text-xl font-medium">Milestones</h2></div>
            <p className="mt-3 flex items-center gap-2 text-sm text-fg2"><Flame size={16} aria-hidden="true" />{streak > 0 ? `${streak}-day learning streak` : 'Complete a lesson to begin a streak'}</p>
            <ul className="mt-3 space-y-2">
              {earned.length === 0 ? <li className="text-sm text-fg2">Complete a lesson to earn your first achievement.</li> : earned.slice(0, 3).map((a) => <li key={a.id} className="flex gap-2 text-sm"><Award size={16} className="mt-0.5 shrink-0 text-link" aria-hidden="true" />{a.title}</li>)}
            </ul>
            <Link to="/certificates" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-link underline underline-offset-4">Certificates and achievements</Link>
          </section>

          <section className="border-t border-soft pt-5">
            <p className="text-sm text-fg2">Course fees are shown in naira. {naira(0)} courses have no fee in this demonstration.</p>
            <button onClick={openAssistant} className={`${btnSecondary} mt-4 w-full`}><Bot size={16} aria-hidden="true" />Ask the learning assistant</button>
            {user.email === 'demo@ukm.example' && <button onClick={() => { if (confirm('Reset all demo data in this browser?')) resetDemo() }} className="pressable mt-2 inline-flex min-h-11 items-center gap-2 text-xs text-muted underline"><RotateCcw size={13} aria-hidden="true" />Reset demo data</button>}
          </section>
        </aside>
      </div>
    </div>
  )
}
