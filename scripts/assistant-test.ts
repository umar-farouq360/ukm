import { answer, SUGGESTIONS } from '../src/assistant'
import { COURSES, allLessons } from '../src/data'
const signed = { signedIn: true, name: 'Amina Demo', progress: { 'csc-101': { status: 'enrolled', via: 'allocated', lessons: allLessons(COURSES.find(c=>c.id==='csc-101')!).slice(0,5).map(l=>l.id), enrolledOn: '' } as any } }
const anon = { signedIn: false, progress: {} }
for (const q of [...SUGGESTIONS, 'What should I study next?', 'explain a loop', 'Is Leadership in Public Institutions open?', 'asdfgh']) {
  const r = answer(q, q.includes('progress') || q.includes('next') ? signed : anon)
  console.log('Q:', q, '\nA:', r.text.split('\n')[0], '| links:', r.links?.map(l=>l.to).join(', ') ?? '-', '| src:', r.source ?? '-', '\n')
}
// data integrity
const ids = new Set(COURSES.map(c=>c.id)); console.log('courses', COURSES.length, 'unique', ids.size)
const lessonIds = COURSES.flatMap(c=>allLessons(c).map(l=>l.id)); console.log('lessons', lessonIds.length, 'unique', new Set(lessonIds).size)
console.log('categories used', [...new Set(COURSES.map(c=>c.category))].join(','))
console.log('free', COURSES.filter(c=>c.price===0).length, 'paid', COURSES.filter(c=>c.price>0).length)
