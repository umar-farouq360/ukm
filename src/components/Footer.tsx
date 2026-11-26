import { Link } from 'react-router-dom'
import { ArrowUp, GraduationCap } from 'lucide-react'
import { footerColumns, footerCta, footerDetails, footerLegal } from '../data/footer'
import { useApp } from '../store'
import { openAssistant } from './Assistant'
import EmailForm from './EmailForm'
import PaperPlane from './PaperPlane'

const heading = 'font-display text-[1.35rem] leading-[1.2] font-medium tracking-[-.01em] md:text-[1.5rem]'
const linkCls = 'inline-flex min-h-11 items-center text-[.9rem] no-underline hover:underline underline-offset-4'

/** Router link, or a button that opens the learning assistant when url is "assistant". */
const FooterLink: React.FC<{ text: string; url: string; className?: string }> = ({ text, url, className = linkCls }) =>
    url === 'assistant'
        ? <button type="button" onClick={openAssistant} className={`${className} text-left`}>{text}</button>
        : <Link to={url} className={className}>{text}</Link>

const Footer: React.FC = () => {
    useApp() // keeps the footer inside the app provider like the rest of the layout
    const { explore, contact, newsletter } = footerColumns

    return (
        <footer className="no-print mt-16 bg-surface pt-[clamp(32px,5vw,60px)] print:hidden">
            {/* Call-to-action card */}
            <div className="mx-auto max-w-[1160px] px-[clamp(12px,4vw,40px)]">
                <div className="relative rounded-[clamp(20px,2.4vw,28px)] bg-[#18191b] px-[clamp(24px,4.5vw,68px)] py-[clamp(32px,5vw,68px)] text-white">
                    <div className="relative z-10 max-w-[640px] md:max-w-[56%] lg:max-w-[640px]">
                        <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight font-medium tracking-[-.01em]">{footerCta.heading}</h2>
                        <p className="mt-6 max-w-[34em] text-[clamp(.95rem,1.3vw,1.1rem)] leading-[1.75] text-[#d9dbde]">{footerCta.description}</p>
                        <div className="mt-8">
                            <EmailForm placeholder={footerCta.placeholder} button={footerCta.button} success={footerCta.success} />
                        </div>
                    </div>
                    <PaperPlane className="pointer-events-none absolute -right-2 top-6 hidden w-[min(42%,520px)] md:block lg:-right-[4%] lg:top-[-4%]" />
                </div>
            </div>

            {/* Footer panel */}
            <div className="mt-[clamp(32px,5vw,60px)] px-[clamp(0px,2.6vw,38px)]">
                <div className="mx-auto max-w-[1280px] rounded-t-[clamp(40px,6vw,90px)] bg-[var(--ft-panel)] px-[clamp(20px,5vw,68px)] pt-[clamp(40px,5vw,68px)] pb-6 text-fg">
                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[261fr_265fr_255fr_362fr]">
                        <Link to="/" aria-label={`${footerDetails.siteName} home`} className="inline-flex items-center gap-2.5 self-start font-display text-[1.9rem] leading-none font-bold tracking-tight no-underline">
                            <GraduationCap size={34} strokeWidth={1.5} aria-hidden="true" />UKM
                        </Link>

                        <nav aria-label={explore.title}>
                            <h2 className={heading}>{explore.title}</h2>
                            <ul className="mt-6 flex flex-col">
                                {explore.links.map((l) => <li key={l.text}><FooterLink {...l} /></li>)}
                                <li className="mt-3">
                                    <Link to={explore.featured.url} className={`${heading} inline-flex items-start gap-1.5 no-underline hover:underline underline-offset-4`}>
                                        {explore.featured.text}<ArrowUp size={12} className="mt-1" aria-hidden="true" />
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        <nav aria-label={contact.title}>
                            <h2 className={heading}>{contact.title}</h2>
                            <ul className="mt-6 flex flex-col">
                                {contact.links.map((l) => <li key={l.text}><FooterLink {...l} /></li>)}
                            </ul>
                        </nav>

                        <div>
                            <h2 className={`${heading} max-w-[15em]`}>{newsletter.title}</h2>
                            <div className="mt-8">
                                <EmailForm variant="light" placeholder={newsletter.placeholder} button={newsletter.button} success={footerCta.success} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-[clamp(40px,6vw,90px)] flex flex-wrap items-center justify-between gap-x-6 border-t border-line pt-4 text-[.9rem] text-fg2">
                        <span>{footerDetails.copyright}</span>
                        <nav aria-label="Legal" className="flex flex-wrap gap-x-8">
                            {footerLegal.map((l) => <Link key={l.text} to={l.url} className="inline-flex min-h-11 items-center no-underline hover:underline underline-offset-4">{l.text}</Link>)}
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
