import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import logo from '../assets/logo.png'
import styles from './Footer.module.css'

export default function Footer() {
  const footerRef = useRef(null)

  useEffect(() => {
    const el = footerRef.current
    gsap.set(el, { opacity: 0, y: 40 })
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
          observer.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <footer ref={footerRef} className={styles.footer}>
      {/* Top strip */}
      <div className={styles.top}>
        <div className={styles.brand}>
          <img src={logo} alt="YE Logo" className={styles.logo} />
          <div className={styles.brandText}>
            <span className={styles.driverName}>YUSUF USMANOV</span>
            <span className={styles.tagline}>Every millisecond. Every corner. Every race.</span>
          </div>
        </div>
        <nav className={styles.nav}>
          <a href="#championships" className={styles.navLink}>Championships</a>
          <a href="#gallery"       className={styles.navLink}>Gallery</a>
          <a href="#contact"       className={styles.navLink}>Contact</a>
          <a href="/admin"         className={styles.navLink}>Admin</a>
        </nav>
        <div className={styles.socials}>
          <a href="https://www.instagram.com/yusa.usm/" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="mailto:usmanov.yusuf0607@gmail.com" rel="noreferrer" className={styles.socialBtn} aria-label="Email">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          </a>
          <a href="tel:++998991424042" rel="noreferrer" className={styles.socialBtn} aria-label="Telephone">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Stats row */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNum}>8</span>
          <span className={styles.statLabel}>Race Number</span>
        </div>
        <div className={styles.statSep} />
        <div className={styles.stat}>
          <span className={styles.statNum}>2025</span>
          <span className={styles.statLabel}>Racing Since</span>
        </div>
        <div className={styles.statSep} />
        <div className={styles.stat}>
          <span className={styles.statNum}>100%</span>
          <span className={styles.statLabel}>Commitment</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <span>© 2026 YUSUF USMANOV</span>
        <span className={styles.dot}>·</span>
        <span>Built for speed</span>
      </div>
    </footer>
  )
}
