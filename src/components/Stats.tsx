import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { instructorById } from '../data'
import { featuredCourse, stats } from '../data/stats'

/** Yellow strip under the hero: one featured course plus headline figures. */
const Stats: React.FC = () => {
    return (
        <section id="stats" aria-label="Featured course and figures" className="bg-hx-strip grid lg:grid-cols-[1.05fr_1fr] items-center gap-6 lg:gap-10 px-[clamp(1.25rem,4.7vw,4.5rem)] py-7 lg:py-10">
            <div className="flex items-center gap-6 lg:gap-10">
                <div className="min-w-0 max-w-[17rem]">
                    <p className="text-sm italic text-hx-muted">{instructorById(featuredCourse.instructorId).name}</p>
                    <p className="mt-1 font-display font-bold text-xl md:text-2xl leading-snug">{featuredCourse.title}</p>
                </div>
                <Link to={`/courses/${featuredCourse.id}`} aria-label={`View ${featuredCourse.title}`} className="shrink-0 grid place-items-center size-14 md:size-16 rounded-full border border-hx-ink hover:bg-hx-ink hover:text-hx-strip transition-colors"><ArrowRight size={22} aria-hidden="true" /></Link>
            </div>

            <dl className="grid grid-cols-3 divide-x divide-hx-ink/30 text-center lg:text-left">
                {stats.map((stat, i) => (
                    <div key={stat.label} className={`${i > 0 ? 'lg:pl-8' : ''} px-2 lg:pr-4`}>
                        <dd className="font-display font-bold text-2xl md:text-3xl xl:text-[34px] leading-none">{stat.value}</dd>
                        <dt className="mt-2 italic text-sm md:text-lg xl:text-2xl">{stat.label}</dt>
                    </div>
                ))}
            </dl>
        </section>
    )
}

export default Stats
