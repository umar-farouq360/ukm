import { Link } from 'react-router-dom'
import { DEMO_EMAIL, DEMO_PASSWORD } from '../store'
import { PageTitle } from '../components/ui'

const REAL = ['Navigation, routing and shareable filter URLs', 'Course search, filtering and sorting', 'Enrolment, allocation and progress tracking (saved in your browser)', 'Lesson completion, resume and certificate eligibility', 'Light and dark themes, low-data mode']
const SIMULATED = ['Accounts and sign-in (no server; passwords are not stored)', 'Payments (demo payment, no real charge, no card details collected)', 'The learning assistant (scripted answers from sample data, not a live AI service)', 'Video lessons (placeholder, no media files)', 'All people, courses, fees and certificates are fictional']

export default function AboutDemo() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 md:py-14">
      <p className="font-mono text-xs font-semibold uppercase tracking-[.14em] text-link">Competition prototype</p>
      <PageTitle title="About this demo">About this demonstration</PageTitle>
      <p className="text-fg2 text-base">UKM University is a fictional institution created as a design entry for an online learning and skills development platform. It has no connection to any real university.</p>
      <div className="grid gap-7 border-y border-soft py-6 md:grid-cols-2">
        <section><h2 className="font-display text-xl font-medium">Working in this browser</h2><ul className="mt-3 list-disc space-y-1 pl-5 text-fg2">{REAL.map((r) => <li key={r}>{r}</li>)}</ul></section>
        <section><h2 className="font-display text-xl font-medium">Simulated for the demo</h2><ul className="mt-3 list-disc space-y-1 pl-5 text-fg2">{SIMULATED.map((r) => <li key={r}>{r}</li>)}</ul></section>
      </div>
      <section className="border-l-4 border-brand bg-selected p-5">
        <h2 className="font-display text-xl font-medium">Reviewer demo path</h2>
        <ol className="mt-2 list-decimal pl-5 space-y-1 text-fg2">
          <li>Home, then search or choose a category.</li>
          <li>Open a free course, press Enrol, and use the demo login ({DEMO_EMAIL} / {DEMO_PASSWORD}).</li>
          <li>Confirm enrolment, then start the first lesson and mark it complete.</li>
          <li>Open the assistant and ask about fees or progress.</li>
          <li>Open Certificates to see a completed course.</li>
        </ol>
        <p className="mt-3"><Link to="/login" className="font-semibold text-link underline">Go to demo login</Link></p>
      </section>
    </div>
  )
}
