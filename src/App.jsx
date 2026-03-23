import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { onAuthChange } from './firebase/auth'
import AnimatedBackground from './components/AnimatedBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Championships from './components/Championships'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Loader from './components/Loader'
import styles from './App.module.css'

// Lazy-load admin bundle
const AdminLogin     = lazy(() => import('./admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'))

function ProtectedRoute({ children }) {
  const [user, setUser]       = useState(undefined)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const unsub = onAuthChange(u => { setUser(u); setChecked(true) })
    return unsub
  }, [])

  if (!checked) return null
  if (!user) return <Navigate to="/admin/login" replace />
  return children
}

function MainLayout({ animate }) {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main className={styles.main}>
        <div className={styles.card}>
          <Hero animate={animate} />
        </div>
        <div className={styles.card}>
          <Championships />
        </div>
        <div className={styles.card}>
          <Gallery />
        </div>
        <div className={styles.card}>
          <Contact />
        </div>
        <div className={`${styles.card} ${styles.footerCard}`}>
          <Footer />
        </div>
      </main>
    </>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<MainLayout animate={!loading} />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}
