import { steps } from '../data/steps'
import { card } from './ui'
import Section from './Section'

const HowItWorks: React.FC = () => {
    return (
        <Section id="how" title="How it works">
            <ol className="grid gap-4 md:grid-cols-4">
                {steps.map((s, i) => (
                    <li key={s.title} className={`${card} p-5`}>
                        <span className="size-8 rounded-full bg-brand text-on-brand grid place-items-center text-sm font-bold" aria-hidden="true">{i + 1}</span>
                        <h3 className="mt-3 text-lg font-semibold"><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
                        <p className="text-fg2 mt-1">{s.description}</p>
                    </li>
                ))}
            </ol>
        </Section>
    )
}

export default HowItWorks
