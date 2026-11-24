import { CATEGORIES, COURSES, INSTRUCTORS } from './courses'
import type { IStat } from '../types'

// Figures come straight from the course data, so they never drift.
export const stats: IStat[] = [
    { label: 'Courses', value: COURSES.length },
    { label: 'Instructors', value: INSTRUCTORS.length },
    { label: 'Programmes', value: CATEGORIES.length },
]

export const featuredCourse = COURSES.find((c) => c.popular) ?? COURSES[0]
