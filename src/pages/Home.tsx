import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Bot, Search } from 'lucide-react'
import { CATEGORIES, COURSES, type CategoryId } from '../data'
import { useApp } from '../store'
import { openAssistant } from '../components/assistant-events'
import HeroVisual from '../components/HeroVisual'
import { CATEGORY_ICON, CourseCard } from '../components/ui'

const QUICK = [
  { label: 'Free courses', to: '/courses?price=free' },
  { label: 'Beginner friendly', to: '/courses?difficulty=Beginner' },
  { label: 'Certificate courses', to: '/courses?category=certificate' },
  { label: 'Short courses', to: '/courses?duration=short' },
]

const CATEGORY_MARK: Record<CategoryId, string> = {
  undergraduate: '01', masters: '02', postgraduate: '03', certificate: '04',
}

function SectionHead({ id, eyebrow, title, sub, action }: { id: string; eyebrow: string; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-soft pb-4">
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[.14em] text-link">{eyebrow}</p>
        <h2 id={id} className="font-display mt-2 text-3xl leading-tight font-medium tracking-[-.02em] md:text-4xl">{title}</h2>
        {sub && <p className="mt-2 max-w-xl text-fg2">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export default function Home() {
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const { user } = useApp()
  const selected = COURSES.filter((course) => course.popular).slice(0, 3)

  const search = (e: FormEvent) => {
    e.preventDefault()
    nav(q.trim() ? `/courses?q=${encodeURIComponent(q.trim())}` : '/courses')
  }

  return (
    <>
      <section className="border-b border-soft" aria-labelledby="page-title">
        <div className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-9 px-4 py-10 md:px-6 md:py-16 lg:grid-cols-[1fr_.92fr] lg:gap-14">
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold uppercase tracking-[.14em] text-link">A fictional university learning platform</p>
            <h1 id="page-title" tabIndex={-1} className="font-display mt-4 max-w-2xl text-[42px] leading-[1.02] font-medium tracking-[-.035em] outline-none sm:text-5xl md:text-6xl">
              UKM University
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg2">
              Explore undergraduate, postgraduate and certificate learning in one text-first demo. Choose a course, see the full outline and learn at your own pace.
            </p>

            <form onSubmit={search} role="search" className="mt-7 flex max-w-xl items-center gap-2 border-b-2 border-brand py-1">
              <label htmlFor="hero-search" className="sr-only">Search courses by name, code, subject or instructor</label>
              <Search size={19} className="ml-1 shrink-0 text-muted" aria-hidden="true" />
              <input id="hero-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses, subjects or instructors" className="min-h-12 min-w-0 flex-1 bg-transparent px-2 text-fg placeholder:text-muted" />
              <button type="submit" className="pressable inline-flex min-h-11 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-on-brand hover:bg-brand-hover">
                Search <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Quick course links">
              {QUICK.map((item) => <li key={item.to}><Link className="min-h-11 inline-flex items-center font-semibold text-link underline decoration-brand/40 underline-offset-4 hover:decoration-brand" to={item.to}>{item.label}</Link></li>)}
            </ul>
            <p className="mt-5 text-sm text-muted">
              {user ? <Link to="/dashboard" className="font-semibold text-link underline underline-offset-2">Continue to my learning</Link> : <>Exploring the demo? <Link to="/about-demo" className="font-semibold text-link underline underline-offset-2">See what is simulated</Link></>}
            </p>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14 md:px-6 md:pt-20" aria-labelledby="programmes-title">
        <SectionHead id="programmes-title" eyebrow="Programme index" title="Choose your path" sub="Browse the fictional catalogue by level or course type." />
        <ul className="mt-2 divide-y divide-soft">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICON[category.id]
            const count = COURSES.filter((course) => course.category === category.id).length
            return (
              <li key={category.id}>
                <Link to={`/courses?category=${category.id}`} className="pressable group grid min-h-24 items-center gap-3 py-5 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-5">
                  <span className="font-mono text-sm font-semibold text-accent">{CATEGORY_MARK[category.id]}</span>
                  <span>
                    <span className="flex items-center gap-2 font-display text-xl font-medium sm:text-2xl"><Icon size={18} className="text-link" aria-hidden="true" />{category.name}</span>
                    <span className="mt-1 block max-w-2xl text-sm text-fg2">{category.description}</span>
                  </span>
                  <span className="flex items-center justify-between gap-4 text-sm font-semibold text-link sm:justify-end"><span>{count} demo {count === 1 ? 'course' : 'courses'}</span><ArrowRight size={18} className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" /></span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 md:px-6 md:pt-24" aria-labelledby="selected-title">
        <SectionHead id="selected-title" eyebrow="From the sample catalogue" title="Start with a course" action={<Link to="/courses" className="pressable inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-link">Explore all courses <ArrowRight size={16} aria-hidden="true" /></Link>} />
        <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {selected.map((course) => <li key={course.id} className="relative"><CourseCard course={course} /></li>)}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 md:px-6 md:pt-24" aria-labelledby="steps-title">
        <SectionHead id="steps-title" eyebrow="How learning works" title="A clear route from interest to completion" />
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['01', 'Find a course', 'Search by subject, level, instructor or course code.'],
            ['02', 'Review the outline', 'Check the fee, prerequisites, outcomes and lessons.'],
            ['03', 'Enrol', 'Confirm the course and see any fee before you proceed.'],
            ['04', 'Learn and track', 'Complete lessons, follow progress and view a demo certificate.'],
          ].map(([n, title, description]) => (
            <li key={n} className="border-t-2 border-brand pt-3">
              <p className="font-mono text-xs font-semibold tracking-[.12em] text-accent">{n}</p>
              <h3 className="font-display mt-3 text-xl font-medium">{title}</h3>
              <p className="mt-1 text-sm text-fg2">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24" aria-labelledby="assistant-title">
        <div className="grid gap-6 border-y border-soft py-8 md:grid-cols-[1fr_auto] md:items-center md:py-10">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[.14em] text-link"><Bot size={15} className="mr-2 inline" aria-hidden="true" />Learning assistant</p>
            <h2 id="assistant-title" className="font-display mt-2 text-3xl font-medium tracking-[-.02em]">Need help choosing?</h2>
            <p className="mt-2 max-w-xl text-fg2">Ask about sample course fees, prerequisites or the enrolment flow. Answers are scripted from the demo catalogue.</p>
          </div>
          <button onClick={openAssistant} className="pressable inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-control px-4 text-sm font-semibold text-fg hover:bg-subtle">Open the assistant <ArrowRight size={16} aria-hidden="true" /></button>
        </div>
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted">UKM University is fictional and created for a design competition. Courses, people and certificates are demonstration data. Enrolment and payment actions are simulated in this browser.</p>
      </section>
    </>
  )
}
