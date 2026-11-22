import { CATEGORIES, COURSES, allLessons, courseById, naira, type Course } from './data'
import { courseDone, type Progress } from './store'

/**
 * DEMO ASSISTANT. Rule-based, runs entirely in the browser and answers from the sample data.
 * It is not a live AI service. A real model would sit behind a server and replace answer().
 */

export interface Reply {
  text: string
  links?: { label: string; to: string }[]
  source?: string
}
export interface Ctx {
  signedIn: boolean
  name?: string
  progress: Record<string, Progress>
  currentCourseId?: string
}

const STOP = new Set(['introduction', 'essentials', 'basics', 'fundamentals', 'applied', 'principles', 'practice', 'organisations', 'institutions', 'public', 'and', 'the', 'for', 'with', 'in', 'of', 'to'])
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim()

const KEYWORDS: Record<string, string> = {
  python: 'csc-101', html: 'cert-102', css: 'cert-102', 'web design': 'cert-102', spreadsheet: 'cert-110', excel: 'cert-110',
  'machine learning': 'msc-510', 'project management': 'cert-130', 'research methods': 'msc-501', 'digital literacy': 'cert-101',
  'discrete': 'mth-101', 'management': 'bus-201', 'communication': 'cert-120', 'educational technology': 'pgd-601',
}

function findCourse(q: string): Course | undefined {
  const n = norm(q)
  for (const c of COURSES) if (n.includes(c.code.toLowerCase()) || n.includes(c.code.toLowerCase().replace('-', ' '))) return c
  const direct = COURSES.find((c) => n.includes(norm(c.title)))
  if (direct) return direct
  for (const [k, id] of Object.entries(KEYWORDS)) if (n.includes(k)) return courseById(id)
  let best: Course | undefined, bestScore = 0
  for (const c of COURSES) {
    const score = norm(c.title).split(' ').filter((w) => w.length > 3 && !STOP.has(w) && n.includes(w)).length
    if (score > bestScore) { best = c; bestScore = score }
  }
  return best
}

const link = (c: Course) => ({ label: c.title, to: `/courses/${c.id}` })

function recommend(q: string, ctx: Ctx): Reply {
  const n = norm(q)
  let pool = COURSES.filter((c) => c.open && !ctx.progress[c.id])
  const notes: string[] = []
  for (const cat of CATEGORIES) {
    if (n.includes(cat.short.toLowerCase())) { pool = pool.filter((c) => c.category === cat.id); notes.push(cat.short.toLowerCase()) }
  }
  const subj = ['computing', 'data', 'business', 'health', 'education', 'communication', 'mathematics'].find((s) => n.includes(s))
  if (subj) { pool = pool.filter((c) => c.subject.toLowerCase() === subj); notes.push(subj) }
  if (/beginner|start|new to|no experience/.test(n)) { pool = pool.filter((c) => c.difficulty === 'Beginner'); notes.push('beginner') }
  if (/free|no cost|cheap/.test(n)) { pool = pool.filter((c) => c.price === 0); notes.push('free') }
  if (/short|quick|fast|few weeks/.test(n)) { pool = pool.filter((c) => c.weeks <= 6); notes.push('short') }

  if (notes.length === 0) {
    // "What should I study next?" uses progress where possible.
    const subjects = new Set(Object.keys(ctx.progress).map((id) => courseById(id)?.subject))
    const sameSubject = pool.filter((c) => subjects.has(c.subject))
    pool = sameSubject.length ? sameSubject : pool.filter((c) => c.popular)
  }
  const picks = pool.slice(0, 3)
  if (picks.length === 0) return { text: 'I could not find an open course matching all of that. Try fewer filters, or browse the full catalogue.', links: [{ label: 'Browse all courses', to: '/courses' }] }
  const why = notes.length ? `Here are open courses that match (${notes.join(', ')}):` : ctx.signedIn && Object.keys(ctx.progress).length ? 'Based on the courses you are already taking, these would be a good next step:' : 'These are popular places to start:'
  return {
    text: `${why}\n${picks.map((c) => `• ${c.title} (${c.code}): ${c.weeks} weeks, ${c.difficulty.toLowerCase()}, ${naira(c.price)}`).join('\n')}`,
    links: picks.map(link),
    source: 'Sample course catalogue',
  }
}

function progressReply(ctx: Ctx): Reply {
  if (!ctx.signedIn) return { text: 'Sign in and I can summarise your progress. You can use the demo login on the sign-in page.', links: [{ label: 'Sign in', to: '/login' }] }
  const entries = Object.entries(ctx.progress)
  if (!entries.length) return { text: 'You are not enrolled in any courses yet. Browse the catalogue to get started.', links: [{ label: 'Browse courses', to: '/courses' }] }
  const lines: string[] = []
  const links: Reply['links'] = []
  for (const [id, p] of entries) {
    const c = courseById(id)
    if (!c) continue
    const total = allLessons(c).length
    const done = p.lessons.length
    if (courseDone(c, p)) lines.push(`• ${c.title}: completed`)
    else if (done > 0) { lines.push(`• ${c.title}: ${done} of ${total} lessons done`); links.push({ label: `Continue ${c.code}`, to: `/learn/${c.id}` }) }
  }
  const notStarted = entries.filter(([, p]) => p.lessons.length === 0).length
  if (notStarted) lines.push(`• ${notStarted} course${notStarted > 1 ? 's' : ''} not started yet`)
  return { text: `Here is where you stand:\n${lines.join('\n')}`, links: links.slice(0, 3).concat([{ label: 'Open dashboard', to: '/dashboard' }]), source: 'Your progress on this device' }
}

const GLOSSARY: Record<string, string> = {
  variable: 'A variable is a named place in memory that holds a value, such as age = 19. You can read it or change it later.',
  loop: 'A loop repeats a block of instructions. A for loop repeats a set number of times; a while loop repeats until a condition is no longer true.',
  function: 'A function is a named, reusable block of code. You give it inputs (parameters) and it can give back a result.',
  binary: 'Binary is base 2: it uses only 0 and 1. Each position is a power of two, so 1011 means 8 + 0 + 2 + 1 = 11.',
  'pivot table': 'A pivot table summarises a large table by grouping rows and calculating totals or averages, such as sales per region.',
  hypothesis: 'A hypothesis is a testable statement about what you expect to find, written before you collect evidence.',
}

export function answer(q: string, ctx: Ctx): Reply {
  const n = norm(q)
  if (!n) return { text: 'Type a question and I will do my best to help.' }

  if (/^(hi|hello|hey|good (morning|afternoon|evening))\b/.test(n)) {
    return { text: `Hello${ctx.name ? ` ${ctx.name.split(' ')[0]}` : ''}! I can help you find courses, explain enrolment and fees, or check your progress. What would you like to do?` }
  }
  const discovery = /(find|recommend|suggest|show me|which|what should|looking for|study next|suitable|beginner|category|courses? in)/.test(n)
  if (!discovery && /certificate|download.*cert|cert.*download/.test(n)) {
    return { text: ctx.signedIn ? 'Your certificates are in the Certificates area. Open a certificate to view, print or save it as PDF. Certificates are only issued once every lesson in a course is complete.' : 'Certificates appear after you complete a course. Sign in to see yours.', links: [{ label: 'Open certificates', to: '/certificates' }], source: 'Platform help' }
  }
  if (/where.*(my )?(enrolled )?courses|my courses|dashboard/.test(n)) {
    return { text: 'All your courses are on your dashboard, with a Continue button that takes you straight back to where you stopped.', links: [{ label: 'Open dashboard', to: '/dashboard' }], source: 'Platform help' }
  }
  if (/progress|how (far|much).*(done|completed)|completion/.test(n)) return progressReply(ctx)

  if (/practice|quiz me|test me|revise|revision/.test(n)) {
    const c = courseById(ctx.currentCourseId ?? '') ?? undefined
    if (c) {
      const qs = c.objectives.slice(0, 3).map((o, i) => `${i + 1}. In your own words: ${o.charAt(0).toLowerCase()}${o.slice(1)}.`)
      return { text: `Here are practice prompts for ${c.title}:\n${qs.join('\n')}\nTry answering without looking, then check the lessons.`, links: [{ label: 'Back to course', to: `/learn/${c.id}` }], source: `Generated from the learning objectives of ${c.code}` }
    }
    return { text: 'Open a course first and ask me again; I will make practice prompts from that course’s learning objectives.', links: [{ label: 'Go to dashboard', to: '/dashboard' }] }
  }
  const term = Object.keys(GLOSSARY).find((t) => n.includes(t))
  if (term && /(what|explain|mean|define)/.test(n)) {
    return { text: GLOSSARY[term], source: 'General explanation, not taken from your course materials' }
  }

  if (/enrol|enroll|register for|sign up for|join a course|how do i (take|start|get)/.test(n) && !findCourse(q)) {
    return {
      text: 'To enrol:\n1. Find a course in the catalogue and open its details page.\n2. Press Enrol and sign in or create an account if asked.\n3. Review the summary. Free courses confirm straight away.\n4. For paid courses, check the fee and use the demo payment step (no real charge).\n5. The course appears on your dashboard.\nCourses allocated to your programme are already on your dashboard; no enrolment needed.',
      links: [{ label: 'Browse courses', to: '/courses' }], source: 'Platform help',
    }
  }
  if (/fee|cost|price|pay|how much|free|afford|scholarship/.test(n)) {
    const c = findCourse(q)
    if (c && !/(find|recommend|suggest)/.test(n)) {
      return { text: `${c.title} (${c.code}) costs ${naira(c.price)}.${c.price ? ' Payment is simulated in this demo; no real charge is made.' : ''}`, links: [link(c)], source: 'Sample course catalogue' }
    }
    if (!/(find|recommend|suggest|show|which|any)/.test(n) || /how much/.test(n)) {
      const paid = COURSES.filter((x) => x.price > 0).map((x) => x.price)
      return { text: `${COURSES.filter((x) => x.price === 0).length} of ${COURSES.length} courses are free. Paid courses range from ${naira(Math.min(...paid))} to ${naira(Math.max(...paid))}. Ask about a specific course for its exact fee, or ask me to find free courses.`, links: [{ label: 'See free courses', to: '/courses?price=free' }], source: 'Sample course catalogue' }
    }
  }
  if (/(find|recommend|suggest|show me|which|what should|looking for|study next|suitable|beginner|best)/.test(n) || /^(courses?|programmes?)\b/.test(n)) return recommend(q, ctx)

  const c = findCourse(q)
  if (c) {
    const state = ctx.progress[c.id]
    const extra = state ? (courseDone(c, state) ? ' You have completed it.' : ' You are already enrolled.') : !c.open ? ' The current intake is closed.' : ''
    return { text: `${c.title} (${c.code}): ${c.summary} It runs for ${c.weeks} weeks at about ${c.hoursPerWeek} hours a week, is ${c.difficulty.toLowerCase()} level and costs ${naira(c.price)}.${extra}`, links: [link(c)], source: 'Sample course catalogue' }
  }
  return {
    text: 'I am not sure about that yet. I can help with: finding courses, fees, how to enrol, where your courses and certificates are, and your progress. Try one of the suggestions below.',
  }
}

export const SUGGESTIONS = [
  'Help me find a beginner course in the Certificate category',
  'How do I enrol in a course?',
  'How much does Project Management cost?',
  'How much progress have I made?',
  'Where can I download my certificate?',
]
