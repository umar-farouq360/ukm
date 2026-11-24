import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { CATEGORIES, COURSES, SUBJECTS, instructorById, type Course } from '../data'
import { CourseCard, PageTitle, btnSecondary, card, inputCls } from '../components/ui'

const DURATIONS = [
  { id: 'short', label: 'Up to 4 weeks', test: (w: number) => w <= 4 },
  { id: 'medium', label: '5 to 8 weeks', test: (w: number) => w >= 5 && w <= 8 },
  { id: 'long', label: '9 weeks or more', test: (w: number) => w >= 9 },
]

function matches(c: Course, q: string) {
  if (!q) return true
  const hay = `${c.title} ${c.code} ${c.subject} ${c.summary} ${instructorById(c.instructorId).name}`.toLowerCase()
  return q.toLowerCase().split(/\s+/).every((t) => hay.includes(t))
}

function Select({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold mb-1.5">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        <option value="">Any</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export default function Courses() {
  const [sp, setSp] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => { const t = setTimeout(() => setLoading(false), 250); return () => clearTimeout(t) }, [])

  const get = (k: string) => sp.get(k) ?? ''
  const set = (k: string, v: string) => {
    const next = new URLSearchParams(sp)
    if (v) next.set(k, v); else next.delete(k)
    if (k === 'category' && v !== 'undergraduate') next.delete('level')
    setSp(next, { replace: true })
  }
  const q = get('q'), category = get('category'), subject = get('subject'), level = get('level'), duration = get('duration'), difficulty = get('difficulty'), price = get('price'), sort = get('sort')
  const [draft, setDraft] = useState(q)
  useEffect(() => setDraft(q), [q])

  const results = useMemo(() => {
    const dur = DURATIONS.find((d) => d.id === duration)
    const list = COURSES.filter((c) =>
      matches(c, q) && (!category || c.category === category) && (!subject || c.subject === subject) && (!level || c.level === level) &&
      (!dur || dur.test(c.weeks)) && (!difficulty || c.difficulty === difficulty) &&
      (!price || (price === 'free' ? c.price === 0 : c.price > 0)))
    const sorted = [...list]
    if (sort === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title))
    else if (sort === 'duration') sorted.sort((a, b) => a.weeks - b.weeks)
    else if (sort === 'price') sorted.sort((a, b) => a.price - b.price)
    else if (sort === 'popular') sorted.sort((a, b) => Number(!!b.popular) - Number(!!a.popular))
    return sorted
  }, [q, category, subject, level, duration, difficulty, price, sort])

  const active = [q, category, subject, level, duration, difficulty, price].filter(Boolean).length
  const clear = () => setSp(new URLSearchParams(), { replace: true })
  const catName = CATEGORIES.find((c) => c.id === category)

  const filters = (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
      <Select id="f-cat" label="Programme category" value={category} onChange={(v) => set('category', v)} options={CATEGORIES.map((c) => ({ value: c.id, label: c.short }))} />
      <Select id="f-sub" label="Subject area" value={subject} onChange={(v) => set('subject', v)} options={SUBJECTS.map((s) => ({ value: s, label: s }))} />
      {category === 'undergraduate' && <Select id="f-lvl" label="Level" value={level} onChange={(v) => set('level', v)} options={['100 Level', '200 Level', '300 Level'].map((s) => ({ value: s, label: s }))} />}
      <Select id="f-dur" label="Duration" value={duration} onChange={(v) => set('duration', v)} options={DURATIONS.map((d) => ({ value: d.id, label: d.label }))} />
      <Select id="f-dif" label="Difficulty" value={difficulty} onChange={(v) => set('difficulty', v)} options={['Beginner', 'Intermediate', 'Advanced'].map((s) => ({ value: s, label: s }))} />
      <Select id="f-prc" label="Fee" value={price} onChange={(v) => set('price', v)} options={[{ value: 'free', label: 'Free' }, { value: 'paid', label: 'Paid' }]} />
      {active > 0 && <button onClick={clear} className={btnSecondary}><X size={16} aria-hidden="true" />Clear all filters</button>}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <PageTitle title={catName ? catName.name : 'Course discovery'}>{catName ? catName.name : 'Find a course'}</PageTitle>
      <p className="text-fg2 mt-1">{catName ? catName.description : 'Search the catalogue or narrow it down with filters.'}</p>

      <form role="search" onSubmit={(e) => { e.preventDefault(); set('q', draft.trim()) }} className="mt-6 flex max-w-3xl gap-2">
        <label htmlFor="q" className="sr-only">Search by course name, code, subject or instructor</label>
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input id="q" type="search" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Course name, code, subject or instructor" className={`${inputCls} pl-10`} />
        </div>
        <button className="inline-flex items-center justify-center min-h-11 px-4 rounded-lg bg-brand text-on-brand font-semibold hover:bg-brand-hover">Search</button>
      </form>

      <div className="mt-7 grid items-start gap-6 lg:grid-cols-[250px_1fr]">
        <aside aria-label="Filters" className="lg:sticky lg:top-20">
          <button onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen} aria-controls="filters" className={`${btnSecondary} w-full justify-between lg:hidden`}>
            <span className="inline-flex items-center gap-2"><SlidersHorizontal size={16} aria-hidden="true" />Filters{active ? ` (${active})` : ''}</span><span aria-hidden="true">{filtersOpen ? '−' : '+'}</span>
          </button>
          <div id="filters" className={`${card} mt-3 p-4 lg:mt-0 ${filtersOpen ? '' : 'hidden'} lg:block`}>
            <h2 className="mb-4 hidden font-display text-xl font-medium lg:block">Narrow results</h2>
            {filters}
          </div>
        </aside>

        <section aria-label="Results">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <p role="status" aria-live="polite" className="font-semibold">
              {loading ? 'Loading courses…' : `${results.length} course${results.length === 1 ? '' : 's'} found`}
              {q && !loading && <span className="font-normal text-fg2"> for “{q}”</span>}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-[13px] font-semibold">Sort by</label>
              <select id="sort" value={sort} onChange={(e) => set('sort', e.target.value)} className={`${inputCls} w-auto`}>
                <option value="">Relevance</option>
                <option value="popular">Demo picks first</option>
                <option value="title">Title A to Z</option>
                <option value="duration">Shortest first</option>
                <option value="price">Lowest price</option>
              </select>
            </div>
          </div>

          {active > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2" aria-label="Applied filters">
              {[q && ['q', `Search: ${q}`], category && ['category', CATEGORIES.find((c) => c.id === category)?.short ?? category], subject && ['subject', subject], level && ['level', level], duration && ['duration', DURATIONS.find((d) => d.id === duration)?.label ?? duration], difficulty && ['difficulty', difficulty], price && ['price', price === 'free' ? 'Free' : 'Paid']]
                .filter((item): item is [string, string] => Boolean(item))
                .map(([key, label]) => <button key={key} onClick={() => set(key, '')} className="pressable inline-flex min-h-9 items-center gap-2 rounded-md border border-control px-2.5 text-xs font-semibold text-fg hover:bg-subtle">{label}<X size={13} aria-hidden="true" /><span className="sr-only">Remove filter</span></button>)}
              <button onClick={clear} className="min-h-9 px-2 text-xs font-semibold text-link underline underline-offset-2">Clear all</button>
            </div>
          )}

          {loading ? (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
              {[0, 1, 2].map((i) => <li key={i} className={`${card} h-72 animate-pulse bg-subtle`} />)}
            </ul>
          ) : results.length === 0 ? (
            <div className={`${card} p-8 text-center`}>
              <h2 className="text-xl font-semibold">No courses match your search</h2>
              <p className="text-fg2 mt-1">Try a different word, or remove some filters.</p>
              <button onClick={clear} className={`${btnSecondary} mt-4`}>Clear search and filters</button>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((c) => <li key={c.id} className="relative"><CourseCard course={c} /></li>)}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
