import { Link } from 'react-router-dom'
import { PageTitle, btnPrimary } from '../components/ui'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-16 text-center">
      <p className="font-mono text-xs font-semibold uppercase tracking-[.14em] text-accent">Page not found</p>
      <PageTitle title="Page not found">We could not find that page</PageTitle>
      <p className="text-fg2">The link may be old, or the course may not exist.</p>
      <Link to="/courses" className={btnPrimary}>Browse courses</Link>
    </div>
  )
}
