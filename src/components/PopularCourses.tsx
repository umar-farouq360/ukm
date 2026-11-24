import { Link } from 'react-router-dom'
import { COURSES } from '../data'
import { CourseCard } from './ui'
import Section from './Section'

const popular = COURSES.filter((c) => c.popular).slice(0, 6)

const PopularCourses: React.FC = () => {
    return (
        <Section
            id="pop"
            title="Popular courses"
            description="What learners are starting right now."
            className="py-4"
            action={<Link to="/courses" className="text-sm font-semibold text-link whitespace-nowrap">View all courses</Link>}
        >
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {popular.map((c) => <li key={c.id} className="relative"><CourseCard course={c} /></li>)}
            </ul>
        </Section>
    )
}

export default PopularCourses
