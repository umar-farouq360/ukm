import { useId, useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'

interface Props {
    placeholder: string;
    button: string;
    success: string;
    /** dark = on the black card, light = on the pale footer panel */
    variant?: 'dark' | 'light';
}

/** Demo email box: validates the address and shows a message. Nothing is sent anywhere. */
const EmailForm: React.FC<Props> = ({ placeholder, button, success, variant = 'dark' }) => {
    const id = useId()
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'error' | 'done'>('idle')
    const dark = variant === 'dark'

    const submit = (e: FormEvent) => {
        e.preventDefault()
        if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setStatus('error'); return }
        setStatus('done')
        setEmail('')
    }

    return (
        <form onSubmit={submit} noValidate className="w-full max-w-[424px]">
            <div className={`flex items-center gap-2 rounded-full border-2 p-1.5 pl-6 ${dark ? 'border-white/20' : 'border-line bg-surface/60'}`}>
                <label htmlFor={id} className="sr-only">Email address</label>
                <input
                    id={id}
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
                    placeholder={placeholder}
                    autoComplete="email"
                    aria-invalid={status === 'error' ? true : undefined}
                    aria-describedby={`${id}-msg`}
                    className={`min-w-0 flex-1 bg-transparent text-[.9rem] outline-none focus-visible:outline-none ${dark ? 'text-white placeholder:text-[#a3a6ab]' : 'text-fg placeholder:text-muted'}`}
                />
                <button type="submit" className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-6 text-[.9rem] font-medium transition-opacity hover:opacity-90 ${dark ? 'bg-white text-black' : 'bg-fg text-surface'}`}>
                    {button}<ArrowRight size={14} aria-hidden="true" />
                </button>
            </div>
            <p id={`${id}-msg`} role={status === 'error' ? 'alert' : 'status'} className={`mt-2 pl-6 text-xs ${status === 'error' ? (dark ? 'text-red-300' : 'text-danger') : dark ? 'text-[#c9ccd1]' : 'text-fg2'}`}>
                {status === 'error' && 'Enter a valid email address, for example name@example.com.'}
                {status === 'done' && success}
            </p>
        </form>
    )
}

export default EmailForm
