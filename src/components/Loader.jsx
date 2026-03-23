import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import logo from '../assets/logo.png'
import styles from './Loader.module.css'

export default function Loader({ onDone }) {
  const overlayRef = useRef(null)
  const logoRef    = useRef(null)

  useEffect(() => {
    const minDisplay = 1400 // ms — minimum time to show loader

    const start = Date.now()

    function hide() {
      const elapsed = Date.now() - start
      const delay   = Math.max(0, minDisplay - elapsed) / 1000

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.6,
        delay,
        ease: 'power2.inOut',
        onComplete: onDone,
      })
    }

    if (document.readyState === 'complete') {
      hide()
    } else {
      window.addEventListener('load', hide, { once: true })
      // Fallback — never block more than 4s
      const timeout = setTimeout(hide, 4000)
      return () => {
        window.removeEventListener('load', hide)
        clearTimeout(timeout)
      }
    }
  }, [onDone])

  return (
    <div ref={overlayRef} className={styles.overlay}>
      <div className={styles.ring}>
        <img ref={logoRef} src={logo} alt="Loading" className={styles.logo} />
      </div>
    </div>
  )
}
