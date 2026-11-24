import type { PropsWithChildren, ReactNode } from 'react'
import Container from './Container'

interface Props {
    id: string;
    title: string;
    description?: string;
    /** Optional link or button shown beside the title. */
    action?: ReactNode;
    className?: string;
}

const Section: React.FC<PropsWithChildren<Props>> = ({ id, title, description, action, className = 'py-12', children }) => {
    return (
        <Container className={className}>
            <section aria-labelledby={id}>
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 id={id} className="text-2xl font-bold">{title}</h2>
                        {description && <p className="text-fg2 mt-1">{description}</p>}
                    </div>
                    {action}
                </div>
                <div className="mt-6">{children}</div>
            </section>
        </Container>
    )
}

export default Section
