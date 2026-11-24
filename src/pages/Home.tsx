import { useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Bot, CheckCircle2, ListChecks, Search, Smartphone, Sparkles, WifiOff } from 'lucide-react'
import { CATEGORIES, COURSES, allLessons, type CategoryId } from '../data'
import { useApp } from '../store'
import { openAssistant } from '../components/Assistant'
import HeroVisual from '../components/HeroVisual'
import { CountUp, Reveal } from '../components/Reveal'
import { CATEGORY_ICON, CourseCard } from '../components/ui'

const pill = 'inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-full text-sm font-semibold transition-colors'
const pillPrimary = `${pill} bg-brand text-on-brand hover:bg-brand-hover`

// Full class names so Tailwind can see them. Each category also keeps its own icon, so colour is never the only cue.
const TINT: Record<CategoryId, string> = {
  undergraduate: 'bg-tint-1',
  masters: 'bg-tint-2',
  postgraduate: 'bg-tint-3',
  certificate: 'bg-tint-4',
}

const STEPS = [
  { t: 'Discover', d: 'Search or filter courses across four programme categories.', tint: 'bg-tint-1' },
  { t: 'Understand', d: 'Read objectives, outline, fees and prerequisites before you decide.', tint: 'bg-tint-2' },
  { t: 'Enrol', d: 'Enrol in a few steps. Fees are shown before you confirm.', tint: 'bg-tint-3' },
  { t: 'Learn and earn', d: 'Follow lessons, track progress and earn a certificate.', tint: 'bg-tint-4' },
]

const QUICK = [
  { label: 'Free courses', to: '/courses?price=free' },
  { label: 'Beginner friendly', to: '/courses?difficulty=Beginner' },
  { label: 'Certificates', to: '/courses?category=certificate' },
  { label: 'Short courses', to: '/courses?duration=short' },
]

function SectionHead({ id, eyebrow, title, sub, action }: { id: string; eyebrow: string; title: string; sub?: string; action?: ReactNode }) {
  return (
    <Reveal className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-link">{eyebrow}</p>
        <h2 id={id} className="text-2xl font-bold mt-1">{title}</h2>
        {sub && <p className="text-fg2 mt-1 max-w-xl">{sub}</p>}
      </div>
      {action}
    </Reveal>
  )
}

export default function Home() {
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const { user } = useApp()
  const popular = COURSES.filter((c) => c.popular).slice(0, 6)
  const lessonCount = COURSES.reduce((n, c) => n + allLessons(c).length, 0)
  const freeCount = COURSES.filter((c) => c.price === 0).length

  const search = (e: FormEvent) => {
    e.preventDefault()
    nav(q.trim() ? `/courses?q=${encodeURIComponent(q.trim())}` : '/courses')
  }

  const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section
        className="relative overflow-x-clip border-b border-soft"
        style={{ background: 'radial-gradient(55% 60% at 88% 8%, var(--tint-1) 0%, transparent 70%), radial-gradient(45% 50% at 0% 100%, var(--tint-4) 0%, transparent 70%), var(--bg)' }}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-8 items-center">
          <div>
            <p className="anim-rise inline-flex items-center gap-2 rounded-full bg-surface border border-soft shadow-soft px-3.5 py-1.5 text-sm font-semibold text-link">
              <Sparkles size={16} aria-hidden="true" /> Online learning and skills development
            </p>
            <h1 id="page-title" tabIndex={-1} style={delay(80)} className="anim-rise mt-5 text-[34px] leading-[40px] md:text-[40px] md:leading-[48px] font-bold max-w-2xl outline-none">
              Find a course. Enrol. Learn at your own pace. Earn your certificate.
            </h1>
            <p style={delay(160)} className="anim-rise mt-4 text-base text-fg2 max-w-xl">
              UKM University brings undergraduate, Masters, postgraduate and certificate courses into one calm, lightweight place, built to work on any device and any connection.
            </p>

            <form onSubmit={search} role="search" style={delay(240)} className="pill anim-rise mt-8 flex items-center gap-1.5 rounded-full bg-surface border border-control shadow-soft p-1.5 max-w-xl">
              <label htmlFor="hero-search" className="sr-only">Search courses by name, code, subject or instructor</label>
              <Search size={18} className="ml-3 shrink-0 text-muted" aria-hidden="true" />
              <input id="hero-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try Python, data or project management" className="pill-input flex-1 min-w-0 min-h-11 bg-transparent px-2 text-fg placeholder:text-muted" />
              <button type="submit" className={`${pillPrimary} !min-h-11`}>Search</button>
            </form>

            <ul style={delay(320)} className="anim-rise mt-5 flex flex-wrap gap-2" aria-label="Quick links">
              {QUICK.map((c) => (
                <li key={c.to}>
                  <Link to={c.to} className="inline-flex items-center min-h-11 rounded-full border border-control bg-surface px-4 text-sm font-semibold text-fg2 hover:bg-selected hover:text-link transition-colors">{c.label}</Link>
                </li>
              ))}
            </ul>

            <p style={delay(400)} className="anim-rise mt-5 text-sm text-fg2">
              {user
                ? <Link to="/dashboard" className="font-semibold text-link underline underline-offset-2">Go to my learning</Link>
                : <>Reviewing the demo? <Link to="/login" className="font-semibold text-link underline underline-offset-2">Use the demo login</Link></>}
            </p>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* ---------- Honest numbers, counted up on scroll ---------- */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-10" aria-label="UKM University at a glance">
        <Reveal>
          <dl className="rounded-3xl bg-tint-4 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { n: CATEGORIES.length, l: 'Programme categories' },
              { n: COURSES.length, l: 'Courses to explore' },
              { n: lessonCount, l: 'Lessons, text-first' },
              { n: freeCount, l: 'Free courses' },
            ].map((s) => (
              <div key={s.l}>
                <dd className="text-[32px] leading-10 font-bold"><CountUp to={s.n} /></dd>
                <dt className="text-fg2">{s.l}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* ---------- Categories ---------- */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-20" aria-labelledby="cats">
        <SectionHead id="cats" eyebrow="Learning categories" title="Four ways to learn" sub="From a first degree to short professional courses. Pick the path that fits your goals." />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = CATEGORY_ICON[cat.id]
            const n = COURSES.filter((c) => c.category === cat.id).length
            return (
              <Reveal as="li" key={cat.id} delay={i * 90}>
                <Link to={`/courses?category=${cat.id}`} className={`group lift flex h-full flex-col gap-3 rounded-3xl p-6 ${TINT[cat.id]}`}>
                  <span className="size-12 rounded-2xl bg-surface shadow-soft grid place-items-center text-link" aria-hidden="true"><Icon size={24} /></span>
                  <span className="text-lg font-semibold leading-6">{cat.name}</span>
                  <span className="text-fg2">{cat.description}</span>
                  <span className="text-xs text-fg2">{cat.who}</span>
                  <span className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold">{n} courses</span>
                    <span className="size-9 rounded-full bg-surface grid place-items-center text-fg transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true"><ArrowRight size={16} /></span>
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </ul>
      </section>

      {/* ---------- Popular courses (swipeable on phones) ---------- */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-20" aria-labelledby="pop">
        <SectionHead id="pop"
          eyebrow="Popular right now"
          title="Courses learners are starting"
          action={<Link to="/courses" className="inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-link">View all courses <ArrowRight size={16} aria-hidden="true" /></Link>}
        />
        <ul className="no-scrollbar mt-8 -mx-4 px-4 pb-3 flex gap-4 overflow-x-auto snap-x snap-mandatory md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
          {popular.map((c, i) => (
            <Reveal as="li" key={c.id} delay={(i % 3) * 90} className="relative snap-start shrink-0 w-[80%] sm:w-[46%] md:w-auto">
              <div className="lift h-full rounded-2xl"><CourseCard course={c} /></div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-20" aria-labelledby="how">
        <SectionHead id="how" eyebrow="Simple by design" title="How it works" />
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.t} delay={i * 110}>
              <div className={`h-full rounded-3xl p-6 ${s.tint}`}>
                <span className="size-10 rounded-full bg-surface shadow-soft grid place-items-center font-bold text-link" aria-hidden="true">{i + 1}</span>
                <h3 className="mt-4 text-lg font-semibold"><span className="sr-only">Step {i + 1}: </span>{s.t}</h3>
                <p className="text-fg2 mt-1">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---------- Benefits ---------- */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-20" aria-labelledby="why">
        <SectionHead id="why" eyebrow="Why UKM" title="Built for real learners" />
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { Icon: ListChecks, t: 'Clear progress', d: 'See completed modules, remaining lessons and exactly what to do next.', tint: 'bg-tint-1' },
            { Icon: WifiOff, t: 'Light on data', d: 'Text-first lessons, no autoplay, and a low-data mode that hides decorative visuals.', tint: 'bg-tint-3' },
            { Icon: Smartphone, t: 'Works on any screen', d: 'Designed for phones first, then tablets and desktops.', tint: 'bg-tint-2' },
          ].map(({ Icon, t, d, tint }, i) => (
            <Reveal as="li" key={t} delay={i * 90}>
              <div className="h-full rounded-3xl border border-soft bg-surface p-6 shadow-soft">
                <span className={`size-11 rounded-2xl grid place-items-center text-link ${tint}`} aria-hidden="true"><Icon size={22} /></span>
                <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                <p className="text-fg2 mt-1">{d}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------- Assistant ---------- */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-20" aria-labelledby="ai">
        <Reveal>
          <div className="rounded-3xl bg-tint-2 p-6 md:p-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm font-semibold text-link inline-flex items-center gap-2"><Bot size={16} aria-hidden="true" /> Learning assistant</p>
              <h2 id="ai" className="text-2xl font-bold mt-1">Not sure where to start? Just ask.</h2>
              <p className="text-fg2 mt-2 max-w-md">Ask about fees, how to enrol, or tell it your goal and it will suggest suitable courses. In this demo the assistant gives scripted answers from the sample course data.</p>
              <button onClick={openAssistant} className={`${pillPrimary} mt-6`}>Open the assistant</button>
            </div>

            <div className="decor rounded-2xl bg-surface shadow-lift p-4 space-y-3" aria-hidden="true">
              <div className="flex justify-end"><p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand text-on-brand px-3.5 py-2.5">How much does Project Management cost?</p></div>
              <div className="flex"><p className="max-w-[90%] rounded-2xl rounded-bl-md bg-subtle px-3.5 py-2.5">Project Management Fundamentals (CERT-130) costs ₦25,000. Payment is simulated in this demo.</p></div>
              <div className="flex gap-1.5 px-2"><span className="dot size-2 rounded-full bg-muted" /><span className="dot size-2 rounded-full bg-muted" /><span className="dot size-2 rounded-full bg-muted" /></div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- Final call to action ---------- */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-deep text-white p-8 md:p-14 text-center">
            <span className="decor pointer-events-none absolute -top-16 -left-16 size-56 rounded-full border border-white/15" aria-hidden="true" />
            <span className="decor pointer-events-none absolute -bottom-20 -right-10 size-64 rounded-full border border-white/15" aria-hidden="true" />
            <div className="relative">
              <h2 className="text-2xl md:text-[32px] md:leading-10 font-bold">Start learning today</h2>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-white/90"><CheckCircle2 size={16} aria-hidden="true" /> Many certificate courses are free.</p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/courses" className={`${pill} bg-white text-deep hover:bg-mint`}>Explore courses</Link>
                <Link to="/register" className={`${pill} border border-white/70 text-white hover:bg-white/10`}>Create an account</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}