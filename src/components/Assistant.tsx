import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bot, Send, X } from 'lucide-react'
import { answer, SUGGESTIONS, type Reply } from '../assistant'
import { useApp } from '../store'
import { inputCls } from './ui'
import { delay, prefersReducedMotion } from '../lib/motion'

interface Msg { role: 'user' | 'bot'; text: string; reply?: Reply }

const WELCOME: Msg = {
  role: 'bot',
  text: 'Hi, I am the UKM learning assistant. Ask me about courses, fees, enrolment or your progress, or ask me to help you find a course.',
}
export default function Assistant({ initiallyOpen = false }: { initiallyOpen?: boolean }) {
  const { user, progress } = useApp()
  const loc = useLocation()
  const [open, setOpen] = useState(initiallyOpen)
  const [render, setRender] = useState(initiallyOpen) // keeps the panel mounted while it animates out
  const [show, setShow] = useState(false) // launcher eases in after the page settles
  const [pulse, setPulse] = useState(false)
  const wasOpen = useRef(initiallyOpen)
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const log = useRef<HTMLDivElement>(null)

  // Opened from other buttons on the page (dashboard, help links).
  useEffect(() => {
    const h = () => setOpen(true)
    window.addEventListener('ukm:assistant', h)
    return () => window.removeEventListener('ukm:assistant', h)
  }, [])

  // Launcher: fade and spring in shortly after mount, pulse a few times, then rest.
  useEffect(() => {
    const t1 = window.setTimeout(() => { setShow(true); setPulse(true) }, 700)
    const t2 = window.setTimeout(() => setPulse(false), 700 + 5600)
    return () => { window.clearTimeout(t1); window.clearTimeout(t2) }
  }, [])

  useEffect(() => { if (open) setRender(true) }, [open])
  useEffect(() => { if (open && render) input.current?.focus({ preventScroll: true }) }, [open, render])
  useEffect(() => {
    if (!open && wasOpen.current) trigger.current?.focus({ preventScroll: true })
    wasOpen.current = open
  }, [open])
  useEffect(() => {
    const el = log.current
    el?.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [msgs, busy])

  const close = () => setOpen(false)

  // Escape closes the panel from anywhere, even after the focused suggestion button has gone.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const currentCourseId = loc.pathname.startsWith('/learn/') ? loc.pathname.split('/')[2] : undefined

  const send = (q: string) => {
    const t = q.trim()
    if (!t || busy) return
    setMsgs((m) => [...m, { role: 'user', text: t }])
    setText('')
    setBusy(true)
    input.current?.focus({ preventScroll: true })
    // Short artificial delay so the loading state is visible and the reply is announced after it.
    window.setTimeout(() => {
      try {
        const reply = answer(t, { signedIn: !!user, name: user?.name, progress, currentCourseId })
        setMsgs((m) => [...m, { role: 'bot', text: reply.text, reply }])
      } catch {
        setMsgs((m) => [...m, { role: 'bot', text: 'Sorry, something went wrong. Please try asking again.' }])
      }
      setBusy(false)
    }, 450)
  }

  return (
    <>
      <button
        ref={trigger}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-show={show && !open}
        data-pulse={pulse}
        inert={!show || open}
        className={`fab no-print fixed right-4 z-40 flex min-h-12 items-center gap-2 rounded-md bg-brand px-4 font-semibold text-on-brand shadow-soft hover:bg-brand-hover ${user ? 'bottom-[calc(4rem+env(safe-area-inset-bottom))]' : 'bottom-4'} md:bottom-6`}
      >
        <Bot size={20} aria-hidden="true" className="fab-icon" /> Ask the assistant
      </button>

      {render && (
        <section
          role="dialog"
          aria-label="UKM learning assistant"
          data-state={open ? 'open' : 'closing'}
          onAnimationEnd={(e) => { if (e.target === e.currentTarget && !open) setRender(false) }}
          onKeyDown={(e) => { if (e.key === 'Escape') close() }}
          className="assistant-panel no-print fixed inset-x-0 bottom-0 z-50 flex h-[min(78dvh,44rem)] flex-col rounded-t-[var(--radius-card)] border border-line bg-surface shadow-lift md:inset-x-auto md:bottom-6 md:right-6 md:h-[600px] md:max-h-[80vh] md:w-[400px] md:rounded-[var(--radius-card)]"
        >
          <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-soft">
            <div>
              <h2 className="font-bold text-base leading-5">Learning assistant</h2>
              <p className="text-xs text-muted">Demo assistant: scripted responses, not a live AI service</p>
            </div>
            <button onClick={close} aria-label="Close assistant" className="pressable group grid size-11 place-items-center rounded-md hover:bg-subtle"><X size={20} aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:rotate-90" /></button>
          </header>

          <div ref={log} role="log" aria-live="polite" aria-label="Conversation" className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {msgs.map((m, i) => (
                <div key={i} className={`anim-msg ${m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
                <div className={`max-w-[88%] whitespace-pre-line rounded-lg px-3.5 py-2.5 ${m.role === 'user' ? 'bg-brand text-on-brand' : 'bg-subtle text-fg'}`}>
                  <span className="sr-only">{m.role === 'user' ? 'You said: ' : 'Assistant said: '}</span>
                  {m.text}
                  {m.reply?.links && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.reply.links.map((l) => (
                        <Link key={l.to + l.label} to={l.to} onClick={() => setOpen(false)} className="pressable rounded-full border border-line bg-surface text-link px-3 py-1.5 text-xs font-semibold hover:bg-selected">{l.label}</Link>
                      ))}
                    </div>
                  )}
                  {m.reply?.source && <p className="mt-2 text-xs text-muted">Source: {m.reply.source}</p>}
                </div>
              </div>
            ))}
            {busy && (
              <div role="status" className="anim-msg flex w-fit items-center gap-1 rounded-lg bg-subtle px-3.5 py-3 text-muted">
                <span className="sr-only">Assistant is typing…</span>
                <span className="dot size-1.5 rounded-full bg-current" aria-hidden="true" /><span className="dot size-1.5 rounded-full bg-current" aria-hidden="true" /><span className="dot size-1.5 rounded-full bg-current" aria-hidden="true" />
              </div>
            )}
            {msgs.length === 1 && (
              <div className="pt-1">
                <p className="text-xs font-semibold text-fg2 mb-2">Try asking</p>
                <ul className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s, i) => (
                    <li key={s} className="anim-rise" style={delay(180 + i * 80)}><button onClick={() => send(s)} className="pressable w-full text-left rounded-xl border border-control px-3 py-2.5 text-sm hover:border-brand hover:bg-selected min-h-11">{s}</button></li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(text) }} className="flex gap-2 p-3 border-t border-soft">
            <label htmlFor="assistant-input" className="sr-only">Message the assistant</label>
            <input id="assistant-input" ref={input} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about courses, fees, progress…" className={inputCls} autoComplete="off" />
            <button type="submit" disabled={!text.trim() || busy} aria-label="Send message" className="pressable group size-11 shrink-0 grid place-items-center rounded-lg bg-brand text-on-brand hover:bg-brand-hover disabled:opacity-60"><Send size={18} aria-hidden="true" className="transition-transform duration-300 ease-out group-enabled:group-hover:translate-x-0.5 group-enabled:group-hover:-translate-y-0.5" /></button>
          </form>
        </section>
      )}
    </>
  )
}
