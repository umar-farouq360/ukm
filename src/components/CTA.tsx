import { Link } from 'react-router-dom'
import { Award, CheckCircle2 } from 'lucide-react'
import { startCta } from '../data/cta'
import { btnPrimary, btnSecondary, card } from './ui'
import Container from './Container'

const CTA: React.FC = () => {
    return (
        <Container className="pb-4">
            <div className={`${card} p-6 md:p-8 text-center`}>
                <Award size={28} className="mx-auto text-link decor" aria-hidden="true" />
                <h2 className="text-2xl font-bold mt-2">{startCta.heading}</h2>
                <p className="text-fg2 mt-1 flex items-center justify-center gap-1.5"><CheckCircle2 size={16} aria-hidden="true" /> {startCta.description}</p>
                <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
                    <Link to="/courses" className={btnPrimary}>Explore courses</Link>
                    <Link to="/register" className={btnSecondary}>Create an account</Link>
                </div>
            </div>
        </Container>
    )
}

export default CTA
