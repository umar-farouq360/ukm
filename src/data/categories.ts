import { CATEGORIES, COURSES } from './courses'
import { stats } from './stats'

export const categoriesDetails = {
    label: 'Learning categories',
    heading: 'Four ways to learn',
}

// Facts shown in the strip above the cards. Numbers come from the course data.
const [courses, instructors, programmes] = stats
export const highlights = [
    `${courses.value} ${courses.label.toLowerCase()}`,
    `${instructors.value} ${instructors.label.toLowerCase()}`,
    `${programmes.value} ${programmes.label.toLowerCase()}`,
    'Certificate on completion',
    'Low-data mode',
]

export const categoryCards = CATEGORIES.map((cat) => {
    const inCategory = COURSES.filter((c) => c.category === cat.id)
    return {
        id: cat.id,
        name: cat.short,
        who: cat.who,
        count: inCategory.length,
        subjects: [...new Set(inCategory.map((c) => c.subject))].slice(0, 3),
    }
})
