import { BrowserRouter as Router, Routes, Route, lazy, Suspense } from 'react-router-dom'
import Welcome from './pages/Welcome'
import CandidatureForm from './pages/CandidatureForm'
import SuiviCandidature from './pages/SuiviCandidature'
import Confirmation from './pages/Confirmation'
import { ToastProvider } from './components/Toast'
import { SkeletonCard } from './components/Skeleton'

// Lazy loading pour les pages RH
const RhLogin = lazy(() => import('./pages/RhLogin'))
const RhDashboard = lazy(() => import('./pages/RhDashboard'))
const RhCandidatureDetail = lazy(() => import('./pages/RhCandidatureDetail'))

// Composant de loading pour lazy loading
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
    <div className="w-full max-w-md space-y-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
)

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Routes publiques - Candidats */}
              <Route path="/" element={<Welcome />} />
              <Route path="/candidature" element={<CandidatureForm />} />
              <Route path="/suivi" element={<SuiviCandidature />} />
              <Route path="/confirmation" element={<Confirmation />} />
              
              {/* Routes RH - Protégées (lazy loaded) */}
              <Route path="/rh/login" element={<RhLogin />} />
              <Route path="/rh/dashboard" element={<RhDashboard />} />
              <Route path="/rh/candidatures/:id" element={<RhCandidatureDetail />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ToastProvider>
  )
}

export default App
