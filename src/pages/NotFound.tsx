import { Link } from 'react-router-dom'
import { PageTitle, btnPrimary } from '../components/ui'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-4">
      <PageTitle title="Page not found">We could not find that page</PageTitle>
      <p className="text-fg2">The link may be old, or the course may not exist.</p>
      <Link to="/courses" className={btnPrimary}>Browse courses</Link>
    </div>
  )
}
