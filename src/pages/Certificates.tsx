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

      <section aria-label={`Certificate for ${course.title}`} className="rounded-2xl border-4 border-double border-brand bg-white text-slate-900 p-6 sm:p-10 text-center">
        <GraduationCap size={40} className="mx-auto" style={{ color: '#0B7A5B' }} aria-hidden="true" />
        <p className="mt-2 text-sm font-semibold tracking-widest uppercase" style={{ color: '#065F46' }}>UKM University</p>
        <PageTitle title={`Certificate: ${course.title}`} className="!text-[30px] sm:!text-[36px] mt-4">Certificate of Completion</PageTitle>
        <p className="mt-6 text-slate-600">This certifies that</p>
        <p className="mt-1 text-3xl font-bold">{user.name}</p>
        <p className="mt-4 text-slate-600">has successfully completed</p>
        <p className="mt-1 text-2xl font-bold" style={{ color: '#065F46' }}>{course.title}</p>
        <p className="text-sm text-slate-600 mt-1">{course.code} · {categoryById(course.category).name}</p>
        <dl className="mt-8 grid sm:grid-cols-3 gap-4 text-sm text-left sm:text-center">
          <div><dt className="text-slate-600">Date of completion</dt><dd className="font-semibold">{longDate(p.completedOn)}</dd></div>
          <div><dt className="text-slate-600">Instructor</dt><dd className="font-semibold">{instructorById(course.instructorId).name}</dd></div>
          <div><dt className="text-slate-600">Certificate number</dt><dd className="font-semibold">UKM-{course.code}-{year}</dd></div>
        </dl>
        <p className="mt-8 text-xs text-slate-600 border-t border-slate-200 pt-4">Demonstration certificate. UKM University is a fictional institution and this certificate has no real-world standing.</p>
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
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-8">
      <PageTitle title="Certificates and achievements">Certificates and achievements</PageTitle>
      <p className="text-fg2 mt-1">Your completed courses, certificates and learning milestones.</p>

      <section aria-labelledby="certs" className="mt-8">
        <h2 id="certs" className="text-2xl font-bold">Completed courses and certificates</h2>
        {done.length === 0 ? (
          <div className={`${card} p-6 mt-4 text-center`}>
            <Award size={28} className="mx-auto text-muted" aria-hidden="true" />
            <p className="font-semibold mt-2">No certificates yet</p>
            <p className="text-fg2">Finish every lesson in a course to earn your first certificate.</p>
            <Link to="/dashboard" className={`${btnSecondary} mt-4`}>Go to my courses</Link>
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {done.map(({ course, p }) => (
              <li key={course.id} className={`${card} p-5 flex flex-col gap-3`}>
                <CheckCircle2 size={24} className="text-link" aria-hidden="true" />
                <div><h3 className="text-lg font-semibold">{course.title}</h3><p className="text-sm text-muted">{course.code} · Completed {longDate(p.completedOn)}</p></div>
                <Link to={`/certificates/${course.id}`} className={`${btnPrimary} mt-auto`}><Award size={16} aria-hidden="true" />View certificate</Link>
              </li>
            ))}
          </ul>
        )}
        {inProgress.length > 0 && (
          <p className="text-sm text-fg2 mt-4">In progress and working towards a certificate: {inProgress.map((e) => e.course.title).join(', ')}.</p>
        )}
      </section>

      <section aria-labelledby="ach" className="mt-10">
        <h2 id="ach" className="text-2xl font-bold">Achievements</h2>
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
