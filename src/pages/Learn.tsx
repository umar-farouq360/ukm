import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Award, ArrowLeft, ArrowRight, Check, ChevronDown, Circle, FileText, ListTree, PlayCircle, Pencil } from 'lucide-react'
import { allLessons, courseById, lessonBody, type LessonType } from '../data'
import { useApp } from '../store'
import { Badge, Notice, ProgressBar, btnPrimary, btnSecondary, card, courseProgress, inputCls } from '../components/ui'
import { nextLessonId } from './Dashboard'
import NotFound from './NotFound'

const ICON: Record<LessonType, typeof FileText> = { reading: FileText, video: PlayCircle, activity: Pencil }
const LABEL: Record<LessonType, string> = { reading: 'Reading', video: 'Video lesson', activity: 'Practice activity' }

export default function Learn() {
  const { id, lessonId } = useParams()
  const { progress, completeLesson, visitLesson } = useApp()
  const course = courseById(id ?? '')
  const p = course ? progress[course.id] : undefined
  const [announce, setAnnounce] = useState('')
  const [showVideo, setShowVideo] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [notes, setNotes] = useState('')

  const lesson = course && lessonId ? allLessons(course).find((l) => l.id === lessonId) : undefined

  useEffect(() => {
    if (course && lesson && p) visitLesson(course.id, lesson.id)
    setShowVideo(false); setNotes(''); setNavOpen(false); setAnnounce('')
    document.title = lesson && course ? `${lesson.title} | ${course.code} | UKM University` : 'Learning | UKM University'
    document.getElementById('lesson-title')?.focus({ preventScroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id, course?.id])

  if (!course) return <NotFound />
  if (!p) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center space-y-4">
        <h1 id="page-title" className="text-2xl font-bold">You are not enrolled in this course</h1>
        <p className="text-fg2">Enrol to access the lessons.</p>
        <Link to={`/courses/${course.id}`} className={btnPrimary}>View course details</Link>
      </div>
    )
  }
  if (!lesson) return <Navigate to={`/learn/${course.id}/${nextLessonId(course, p)}`} replace />

  const lessons = allLessons(course)
  const idx = lessons.findIndex((l) => l.id === lesson.id)
  const prev = lessons[idx - 1], next = lessons[idx + 1]
  const mod = course.modules.find((m) => m.lessons.some((l) => l.id === lesson.id))!
  const done = p.lessons.includes(lesson.id)
  const cp = courseProgress(course, p)
  const body = lessonBody(course, mod.title, lesson)
  const Icon = ICON[lesson.type]

  const toggle = () => {
    const nowDone = !done
    completeLesson(course.id, lesson.id, nowDone)
    const count = cp.done + (nowDone ? 1 : -1)
    setAnnounce(nowDone ? `Lesson marked complete. ${count} of ${cp.total} lessons done.` : `Lesson marked as not complete. ${count} of ${cp.total} lessons done.`)
  }

  const contents = (
    <nav aria-label="Course contents">
      <ol className="space-y-4">
        {course.modules.map((m, mi) => {
          const mDone = m.lessons.filter((l) => p.lessons.includes(l.id)).length
          return (
            <li key={m.id}>
              <p className="text-sm font-semibold">Module {mi + 1}: {m.title}</p>
              <p className="text-xs text-muted mb-1">{mDone} of {m.lessons.length} complete</p>
              <ul>
                {m.lessons.map((l) => {
                  const LIcon = ICON[l.type]
                  const isDone = p.lessons.includes(l.id)
                  const current = l.id === lesson.id
                  return (
                    <li key={l.id}>
                      <Link to={`/learn/${course.id}/${l.id}`} aria-current={current ? 'page' : undefined} className={`pressable flex items-start gap-2 rounded-lg px-2 py-2.5 min-h-11 text-sm ${current ? 'bg-selected font-semibold text-link' : 'hover:bg-subtle hover:translate-x-0.5'}`}>
                        {isDone ? <Check size={16} className="anim-pop mt-0.5 shrink-0 text-link" aria-hidden="true" /> : <Circle size={16} className="mt-0.5 shrink-0 text-muted" aria-hidden="true" />}
                        <span className="flex-1">{l.title}<span className="sr-only">{isDone ? ' (complete)' : ' (not complete)'}, {LABEL[l.type]}</span></span>
                        <LIcon size={14} className="mt-1 shrink-0 text-muted" aria-hidden="true" />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ol>
    </nav>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-soft pb-5">
        <div>
          <Link to="/dashboard" className="pressable inline-flex min-h-11 items-center gap-2 text-sm text-fg2 hover:text-link"><ArrowLeft size={14} aria-hidden="true" />My learning</Link>
          <p className="font-display mt-1 text-xl font-medium leading-tight">{course.title}</p>
        </div>
        <div className="w-full sm:w-72"><ProgressBar done={cp.done} total={cp.total} label={`${cp.modulesDone} of ${cp.modulesTotal} modules · ${cp.done} of ${cp.total} lessons`} /></div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
        <aside className="lg:sticky lg:top-20">
          <button onClick={() => setNavOpen((o) => !o)} aria-expanded={navOpen} aria-controls="contents" className={`${btnSecondary} w-full lg:hidden justify-between`}>
            <span className="inline-flex items-center gap-2"><ListTree size={16} aria-hidden="true" />Course contents</span><ChevronDown size={16} className={`transition-transform duration-300 ease-out ${navOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          <div id="contents" data-open={navOpen} className="collapse-y lg-open">
            <div>
              <div className="pt-3 lg:pt-0">
                <div className={`${card} max-h-[min(65dvh,38rem)] overflow-y-auto bg-subtle p-4 lg:max-h-[calc(100dvh-7rem)]`}>{contents}</div>
              </div>
            </div>
          </div>
        </aside>

        <article key={lesson.id} className="page-enter min-w-0 max-w-4xl" aria-labelledby="lesson-title">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <Badge tone="brand"><Icon size={12} aria-hidden="true" />{LABEL[lesson.type]}</Badge>
            <span>Module: {mod.title}</span><span>· Lesson {idx + 1} of {lessons.length} · about {lesson.minutes} min</span>
          </div>
          <h1 id="lesson-title" tabIndex={-1} className="font-display mt-3 text-[34px] leading-[1.08] font-medium tracking-[-.025em] outline-none sm:text-[42px]">{lesson.title}</h1>

          {lesson.type === 'video' && (
            <div className="mt-5">
              {showVideo ? (
                <div role="region" aria-label="Video player placeholder" className="anim-pop grid aspect-video place-items-center rounded-lg border border-soft bg-subtle p-4 text-center">
                  <p className="text-fg2 max-w-sm">Demo: no video file is included in this prototype, so nothing was downloaded. A real course would stream the video here only after you pressed play.</p>
                </div>
              ) : (
                <button onClick={() => setShowVideo(true)} className="pressable group grid aspect-video w-full place-items-center rounded-lg border border-soft bg-subtle hover:bg-selected">
                  <span className="flex flex-col items-center gap-2 font-semibold"><PlayCircle size={44} className="text-link transition-transform duration-300 ease-out group-hover:scale-110" aria-hidden="true" />Play video (loads only when you press play)</span>
                </button>
              )}
            </div>
          )}

          <div className="prose-lesson mt-6">
            {body.paragraphs.map((t) => <p key={t}>{t}</p>)}
            <h3>{lesson.type === 'activity' ? 'Steps' : 'Key points'}</h3>
            <ul>{body.points.map((t) => <li key={t}>{t}</li>)}</ul>
            {body.transcript && (
              <details className="mt-4 rounded-xl border border-soft p-4">
                <summary className="cursor-pointer font-semibold min-h-11 flex items-center">Read the transcript instead</summary>
                <p className="mt-2">{body.transcript}</p>
              </details>
            )}
          </div>

          {lesson.type === 'activity' && (
            <div className="mt-2 max-w-xl">
              <label htmlFor="notes" className="block text-[13px] font-semibold mb-1.5">Your notes (not saved in this demo)</label>
              <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className={`${inputCls} py-2`} />
            </div>
          )}

          <div className="mt-10 flex flex-col gap-4 border-t border-soft pt-5">
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={toggle} aria-pressed={done} className={done ? btnSecondary : btnPrimary}>
                <span key={String(done)} className="anim-pop inline-grid"><Check size={16} aria-hidden="true" /></span>{done ? 'Completed (press to undo)' : 'Mark as complete'}
              </button>
              <p role="status" aria-live="polite" className="text-sm font-semibold text-link">{announce}</p>
            </div>

            {cp.complete && (
              <Notice><Award size={16} className="inline mr-1" aria-hidden="true" />Course complete! Your certificate is ready. <Link to={`/certificates/${course.id}`} className="font-semibold underline">View certificate</Link></Notice>
            )}

            <nav aria-label="Lesson navigation" className="flex items-center justify-between gap-3">
              {prev ? <Link to={`/learn/${course.id}/${prev.id}`} className={btnSecondary}><ArrowLeft size={16} aria-hidden="true" />Previous</Link> : <span />}
              {next ? <Link to={`/learn/${course.id}/${next.id}`} className={done ? btnPrimary : btnSecondary}>Next lesson<ArrowRight size={16} aria-hidden="true" /></Link> : <Link to="/dashboard" className={btnSecondary}>Back to dashboard</Link>}
            </nav>
          </div>
        </article>
      </div>
    </div>
  )
}
