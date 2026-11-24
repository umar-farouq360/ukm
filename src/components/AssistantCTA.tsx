import { Bot } from 'lucide-react'
import { assistantCta } from '../data/cta'
import { openAssistant } from './Assistant'
import { btnPrimary } from './ui'
import Container from './Container'

const AssistantCTA: React.FC = () => {
    return (
        <Container className="py-12">
            <div className="rounded-2xl bg-selected border border-line p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                <span className="size-14 shrink-0 rounded-2xl bg-brand text-on-brand grid place-items-center decor" aria-hidden="true"><Bot size={28} /></span>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold">{assistantCta.heading}</h2>
                    <p className="text-fg2 mt-1 max-w-2xl">{assistantCta.description}</p>
                </div>
                <button onClick={openAssistant} className={btnPrimary}>Open assistant</button>
            </div>
        </Container>
    )
}

export default AssistantCTA
