import { useId, type ReactNode } from 'react'

export const authFieldCls = 'w-full h-[43px] rounded-md border border-au-line bg-au-field pl-10 pr-3 text-sm text-au-ink placeholder:text-au-muted'

interface InputProps {
    id: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
}

interface Props {
    label: string;
    error?: string;
    icon: ReactNode;
    children: (props: InputProps) => ReactNode;
}

/** One icon-led field. The label is visually hidden because the icon and placeholder carry it on screen. */
const AuthField: React.FC<Props> = ({ label, error, icon, children }) => {
    const id = useId()
    return (
        <div>
            <label htmlFor={id} className="sr-only">{label}</label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-au-muted pointer-events-none" aria-hidden="true">{icon}</span>
                {children({ id, 'aria-describedby': error ? `${id}-e` : undefined, 'aria-invalid': error ? true : undefined })}
            </div>
            {error && <p id={`${id}-e`} role="alert" className="text-xs font-semibold text-danger mt-1">{error}</p>}
        </div>
    )
}

export default AuthField
