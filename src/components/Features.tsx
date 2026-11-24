import { features } from '../data/features'
import Section from './Section'

const Features: React.FC = () => {
    return (
        <Section id="why" title="Built for real learners" className="py-0">
            <ul className="grid gap-4 md:grid-cols-3">
                {features.map((f) => (
                    <li key={f.title} className="flex gap-3">
                        <span className="size-10 shrink-0 rounded-lg bg-mint text-link grid place-items-center" aria-hidden="true">{f.icon}</span>
                        <div><h3 className="font-semibold text-base">{f.title}</h3><p className="text-fg2">{f.description}</p></div>
                    </li>
                ))}
            </ul>
        </Section>
    )
}

export default Features
