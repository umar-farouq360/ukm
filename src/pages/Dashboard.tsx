import { Link } from 'react-router-dom'
import { Award, Bell, Bot, CheckCircle2, Flame, Pencil, RotateCcw } from 'lucide-react'
import { COURSES, PROGRAMMES, allLessons, courseById, instructorById, naira, type Course } from '../data'
import { useApp, type Progress } from '../store'
import { openAssistant } from '../components/Assistant'
import { Badge, CourseCard, PageTitle, ProgressBar, btnPrimary, btnSecondary, card, courseProgress } from '../components/ui'

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
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
      <PageTitle title="My learning">Welcome back, {user.name.split(' ')[0]}</PageTitle>
      <p className="text-fg2 mt-1">{programme && programme.id !== 'none' ? `${programme.label}. ` : ''}Here is what to do next.</p>

      {recent ? (
        <section aria-labelledby="continue" className={`${card} p-5 mt-6 border-brand`}>
          <h2 id="continue" className="text-sm font-semibold text-link">Continue learning</h2>
          <div className="mt-2 grid md:grid-cols-[1fr_auto] gap-4 items-center">
            <div>
              <p className="text-xl font-bold">{recent.course.title}</p>
              <p className="text-sm text-fg2">
                Next up: {allLessons(recent.course).find((l) => l.id === nextLessonId(recent.course, recent.p))?.title} · Last studied {fmt(recent.p.accessed).toLowerCase()}
              </p>
              <div className="mt-3 max-w-md">
                {(() => { const cp = courseProgress(recent.course, recent.p); return <ProgressBar done={cp.done} total={cp.total} label={`${cp.modulesDone} of ${cp.modulesTotal} modules · ${cp.done} of ${cp.total} lessons`} /> })()}
              </div>
            </div>
            <Link to={`/learn/${recent.course.id}/${nextLessonId(recent.course, recent.p)}`} className={btnPrimary}>{recent.p.lessons.length ? 'Resume lesson' : 'Start learning'}</Link>
          </div>
        </section>
      ) : (
        <section className={`${card} p-6 mt-6 text-center`}>
          <h2 className="text-xl font-semibold">You are not enrolled in any courses yet</h2>
          <p className="text-fg2 mt-1">Find a course that suits your goals.</p>
          <Link to="/courses" className={`${btnPrimary} mt-4`}>Browse courses</Link>
        </section>
      )}

      <div className="mt-8 grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-10">
          {active.length > 0 && (
            <section aria-labelledby="mine">
              <h2 id="mine" className="text-2xl font-bold">My courses</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {active.map(({ course, p }) => {
                  const cp = courseProgress(course, p)
                  const state = p.lessons.length === 0 && p.via === 'allocated' ? 'Allocated' : p.lessons.length === 0 ? 'Not started' : 'In progress'
                  return (
                    <li key={course.id} className={`${card} p-4 flex flex-col gap-3`}>
                      <div className="flex flex-wrap gap-1.5"><Badge tone="brand">{state}</Badge>{p.via === 'allocated' && <Badge>Allocated to programme</Badge>}</div>
                      <div>
                        <h3 className="text-lg font-semibold leading-6">{course.title}</h3>
                        <p className="text-xs text-muted">{course.code} · {instructorById(course.instructorId).name}</p>
                      </div>
                      <ProgressBar done={cp.done} total={cp.total} label={`${cp.modulesDone} of ${cp.modulesTotal} modules complete`} />
                      <p className="text-xs text-muted">Last accessed: {fmt(p.accessed)}</p>
                      <Link to={`/learn/${course.id}/${nextLessonId(course, p)}`} className={`${btnPrimary} mt-auto`}>{cp.done ? 'Continue learning' : 'Start course'}</Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {completed.length > 0 && (
            <section aria-labelledby="done">
              <h2 id="done" className="text-2xl font-bold">Completed courses</h2>
              <ul className="mt-4 space-y-3">
                {completed.map(({ course, p }) => (
                  <li key={course.id} className={`${card} p-4 flex flex-wrap items-center gap-3 justify-between`}>
                    <div className="flex items-center gap-3"><CheckCircle2 className="text-link" size={22} aria-hidden="true" /><div><p className="font-semibold">{course.title}</p><p className="text-xs text-muted">Completed {p.completedOn}</p></div></div>
                    <Link to={`/certificates/${course.id}`} className={btnSecondary}><Award size={16} aria-hidden="true" />View certificate</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="rec">
            <h2 id="rec" className="text-2xl font-bold">Recommended for you</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recs.map((c) => <li key={c.id} className="relative"><CourseCard course={c} /></li>)}
            </ul>
          </section>
        </div>

        <aside className="space-y-6" aria-label="Activity and updates">
          <section aria-labelledby="todo" className={`${card} p-4`}>
            <h2 id="todo" className="text-lg font-semibold">Outstanding activities</h2>
            {outstanding.length === 0 ? <p className="text-fg2 mt-2">Nothing outstanding. Nice work.</p> : (
              <ul className="mt-3 divide-y divide-soft">
                {outstanding.map(({ course, lesson }) => (
                  <li key={lesson.id}>
                    <Link to={`/learn/${course.id}/${lesson.id}`} className="flex gap-3 py-3 min-h-11 hover:bg-subtle rounded-lg px-1">
                      <Pencil size={16} className="mt-1 text-muted shrink-0" aria-hidden="true" />
                      <span><span className="block font-semibold text-sm">{lesson.title}</span><span className="block text-xs text-muted">{course.code} · about {lesson.minutes} min</span></span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="ach" className={`${card} p-4`}>
            <div className="flex items-center justify-between">
              <h2 id="ach" className="text-lg font-semibold">Achievements</h2>
              <Link to="/certificates" className="text-sm font-semibold text-link">View all</Link>
            </div>
            <p className="text-sm text-fg2 mt-1 flex items-center gap-1.5"><Flame size={16} aria-hidden="true" />{streak > 0 ? `${streak}-day learning streak` : 'Start a streak by learning today'}</p>
            <ul className="mt-3 space-y-2">
              {earned.length === 0 ? <li className="text-fg2">Complete a lesson to earn your first achievement.</li> : earned.slice(0, 3).map((a) => (
                <li key={a.id} className="flex gap-2 text-sm"><Award size={16} className="text-link shrink-0 mt-0.5" aria-hidden="true" />{a.title}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="news" className={`${card} p-4`}>
            <h2 id="news" className="text-lg font-semibold flex items-center gap-2"><Bell size={16} aria-hidden="true" />Announcements</h2>
            <ul className="mt-3 space-y-3 text-sm">
              <li><span className="font-semibold">Low-data mode is available.</span> Use the toggle in the header to hide decorative visuals.</li>
              <li><span className="font-semibold">Postgraduate Leadership intake has closed.</span> The next intake opens in the new year.</li>
            </ul>
          </section>

          <button onClick={openAssistant} className={`${btnSecondary} w-full`}><Bot size={16} aria-hidden="true" />Ask the learning assistant</button>
          {user.email === 'demo@ukm.example' && (
            <button onClick={() => { if (confirm('Reset all demo data in this browser?')) resetDemo() }} className="text-xs text-muted underline inline-flex items-center gap-1 min-h-11"><RotateCcw size={12} aria-hidden="true" />Reset demo data</button>
          )}
          <p className="text-xs text-muted">Fees on recommended courses are in naira; {naira(0)} means no charge.</p>
        </aside>
      </div>
    </div>
  )
}
