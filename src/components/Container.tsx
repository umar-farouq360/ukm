import type { PropsWithChildren } from 'react'

interface Props {
    className?: string;
}

const Container: React.FC<PropsWithChildren<Props>> = ({ children, className = '' }) => {
    return <div className={`mx-auto w-full max-w-7xl px-4 md:px-6 ${className}`}>{children}</div>
}

export default Container
