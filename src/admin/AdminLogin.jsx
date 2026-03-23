import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../firebase/auth'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const formRef = useRef(null)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signIn(email, password)
      navigate('/admin')
    } catch (err) {
      setError('Invalid credentials. Try again.')
      gsap.to(formRef.current, {
        x: [-8, 8, -6, 6, 0],
        duration: 0.4,
        ease: 'none',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.header}>
          <span className={styles.tag}>ADMIN</span>
          <h1 className={styles.title}>PIT LANE</h1>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className={styles.input}
            placeholder="admin@example.com"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className={styles.input}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? 'ENTERING...' : 'ENTER PIT LANE'}
        </button>
      </form>
    </div>
  )
}
