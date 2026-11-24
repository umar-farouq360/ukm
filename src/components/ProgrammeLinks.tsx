import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data'

const ProgrammeLinks: React.FC = () => {
    return (
        <nav aria-label="Programmes" className="mt-10 lg:mt-14">
            <ul className="flex flex-wrap items-center gap-x-6 xl:gap-x-8 gap-y-2">
                {CATEGORIES.map((c) => (
                    <li key={c.id}>
                        <Link to={`/courses?category=${c.id}`} className="font-display font-bold text-xl tracking-tight inline-flex items-center min-h-11 hover:underline underline-offset-4">{c.short}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default ProgrammeLinks
