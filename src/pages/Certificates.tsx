import { Link, useParams } from 'react-router-dom'
import { Award, CheckCircle2, GraduationCap, Lock, Printer } from 'lucide-react'
import { categoryById, courseById, instructorById } from '../data'
import { useApp } from '../store'
import { PageTitle, btnPrimary, btnSecondary, card, courseProgress } from '../components/ui'
import NotFound from './NotFound'

const longDate = (d?: string) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '')

function CertificateView({ courseId }: { courseId: string }) {
  const { user, progress } = useApp()
  const course = courseById(courseId)
  const p = progress[courseId]
  if (!course || !user) return <NotFound />

  if (!p || !courseProgress(course, p).complete) {
    const cp = courseProgress(course, p)
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center space-y-4">
        <Lock size={32} className="mx-auto text-muted" aria-hidden="true" />
        <PageTitle title="Certificate not available">Certificate not available yet</PageTitle>
        <p className="text-fg2">Certificates are issued only when every lesson in a course is complete. {p ? `You have completed ${cp.done} of ${cp.total} lessons.` : 'You are not enrolled in this course.'}</p>
        <Link to={p ? `/learn/${course.id}` : `/courses/${course.id}`} className={btnPrimary}>{p ? 'Continue learning' : 'View course'}</Link>
      </div>
    )
  }

  const year = (p.completedOn ?? '').slice(0, 4)
  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
      <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-5">
        <Link to="/certificates" className="text-sm font-semibold text-link">← All certificates</Link>
        <button onClick={() => window.print()} className={btnPrimary}><Printer size={16} aria-hidden="true" />Print or save as PDF</button>
      </div>

      <section aria-label={`Demonstration certificate for ${course.title}`} className="certificate rounded-xl border-2 border-double border-brand bg-surface p-6 text-center text-fg sm:p-10">
        <p className="mx-auto mb-6 inline-flex min-h-8 items-center border border-accent px-3 font-mono text-[10px] font-semibold uppercase tracking-[.14em] text-accent">Fictional demo certificate</p>
        <GraduationCap size={40} className="mx-auto text-link" aria-hidden="true" />
        <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-link">UKM University</p>
        <PageTitle title={`Certificate: ${course.title}`} className="!text-[30px] sm:!text-[36px] mt-4">Certificate of Completion</PageTitle>
        <p className="mt-6 text-fg2">This certifies that</p>
        <p className="mt-1 font-display text-3xl font-medium">{user.name}</p>
        <p className="mt-4 text-fg2">has successfully completed</p>
        <p className="mt-1 font-display text-2xl font-medium text-link">{course.title}</p>
        <p className="mt-1 text-sm text-fg2">{course.code} · {categoryById(course.category).name}</p>
        <dl className="mt-8 grid gap-4 border-t border-soft pt-5 text-left text-sm sm:grid-cols-3 sm:text-center">
          <div><dt className="text-muted">Date of completion</dt><dd className="font-semibold">{longDate(p.completedOn)}</dd></div>
          <div><dt className="text-muted">Instructor</dt><dd className="font-semibold">{instructorById(course.instructorId).name}</dd></div>
          <div><dt className="text-muted">Certificate number</dt><dd className="font-semibold">UKM-{course.code}-{year}</dd></div>
        </dl>
        <p className="mt-8 border-t border-soft pt-4 text-xs text-muted">Demonstration certificate. UKM University is fictional and this certificate has no real-world standing.</p>
      </section>
    </div>
  )
}

export default function Certificates() {
  const { id } = useParams()
  const { progress, achievements, streak } = useApp()
  if (id) return <CertificateView courseId={id} />

  const done = Object.entries(progress).map(([cid, p]) => ({ course: courseById(cid)!, p })).filter((e) => e.course && courseProgress(e.course, e.p).complete)
  const inProgress = Object.entries(progress).map(([cid, p]) => ({ course: courseById(cid)!, p })).filter((e) => e.course && !courseProgress(e.course, e.p).complete && e.p.lessons.length > 0)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <PageTitle title="Certificates and achievements">Certificates and achievements</PageTitle>
      <p className="text-fg2 mt-1">Your completed courses, certificates and learning milestones.</p>

      <section aria-labelledby="certs" className="mt-8">
        <h2 id="certs" className="font-display text-2xl font-medium">Completed courses and certificates</h2>
        {done.length === 0 ? (
          <div className="mt-4 border-y border-soft py-7 text-center">
            <Award size={28} className="mx-auto text-muted" aria-hidden="true" />
            <p className="font-semibold mt-2">No certificates yet</p>
            <p className="text-fg2">Finish every lesson in a course to earn your first certificate.</p>
            <Link to="/dashboard" className={`${btnSecondary} mt-4`}>Go to my courses</Link>
          </div>
        ) : (
            <ul className="mt-4 divide-y divide-soft border-y border-soft">
            {done.map(({ course, p }) => (
              <li key={course.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div className="flex min-w-0 items-start gap-3"><CheckCircle2 size={20} className="mt-1 shrink-0 text-link" aria-hidden="true" /><div><h3 className="font-display text-xl font-medium">{course.title}</h3><p className="text-sm text-muted">{course.code} · Completed {longDate(p.completedOn)}</p></div></div>
                <Link to={`/certificates/${course.id}`} className={btnSecondary}><Award size={16} aria-hidden="true" />View certificate</Link>
              </li>
            ))}
          </ul>
        )}
        {inProgress.length > 0 && (
          <p className="text-sm text-fg2 mt-4">In progress and working towards a certificate: {inProgress.map((e) => e.course.title).join(', ')}.</p>
        )}
      </section>

      <section aria-labelledby="ach" className="mt-10">
        <h2 id="ach" className="font-display text-2xl font-medium">Achievements</h2>
        <p className="text-fg2 mt-1">Current learning streak: {streak} {streak === 1 ? 'day' : 'days'}.</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {achievements.map((a) => (
            <li key={a.id} className={`${card} p-4 flex gap-3 ${a.earned ? '' : 'bg-subtle'}`}>
              {a.earned ? <Award size={22} className="text-link shrink-0" aria-hidden="true" /> : <Lock size={22} className="text-muted shrink-0" aria-hidden="true" />}
              <div>
                <p className="font-semibold">{a.title} <span className="text-xs font-semibold text-fg2">{a.earned ? '· Earned' : '· Locked'}</span></p>
                <p className="text-sm text-fg2">{a.earned ? a.detail : a.hint}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
