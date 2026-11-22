import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import { Spinner } from './components/ui'
import { useApp } from './store'
import Home from './pages/Home'

// Route-level code splitting: only the home page is in the first-load bundle.
const Courses = lazy(() => import('./pages/Courses'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const Enrol = lazy(() => import('./pages/Enrol'))
const Auth = lazy(() => import('./pages/Auth'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Learn = lazy(() => import('./pages/Learn'))
const Certificates = lazy(() => import('./pages/Certificates'))
const AboutDemo = lazy(() => import('./pages/AboutDemo'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Protected({ children }: { children: ReactNode }) {
  const { user } = useApp()
  const loc = useLocation()
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="enrol/:id" element={<Protected><Enrol /></Protected>} />
          <Route path="login" element={<Auth mode="login" />} />
          <Route path="register" element={<Auth mode="register" />} />
          <Route path="dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="learn/:id/:lessonId?" element={<Protected><Learn /></Protected>} />
          <Route path="certificates" element={<Protected><Certificates /></Protected>} />
          <Route path="certificates/:id" element={<Protected><Certificates /></Protected>} />
          <Route path="about-demo" element={<AboutDemo />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
