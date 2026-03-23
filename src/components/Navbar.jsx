import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from '../assets/logo.png'
import styles from './Navbar.module.css'

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = [
  { label: 'CHAMPIONSHIPS', href: '#championships' },
  { label: 'GALLERY',       href: '#gallery' },
  { label: 'CONTACT',       href: '#contact' },
]

export default function Navbar() {
  const navRef  = useRef(null)
  const logoRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const overlayRef = useRef(null)
  const menuTl = useRef(null)

  useEffect(() => {
    // Shrink navbar on scroll
    ScrollTrigger.create({
      start: 'top top-=80',
      onEnter:      () => gsap.to(navRef.current,  { height: 'var(--nav-height-shrunk)', duration: 0.3, ease: 'power2.out' }),
      onLeaveBack:  () => gsap.to(navRef.current,  { height: 'var(--nav-height)',         duration: 0.3, ease: 'power2.out' }),
    })

    // Build menu timeline once
    menuTl.current = gsap.timeline({ paused: true })
      .to(overlayRef.current, { x: '0%', duration: 0.5, ease: 'power3.inOut' })
      .from(overlayRef.current.querySelectorAll('.' + styles.overlayLink), {
        y: 40, opacity: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out',
      }, '-=0.2')

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  useEffect(() => {
    if (menuOpen) {
      menuTl.current.play()
    } else {
      menuTl.current.reverse()
    }
  }, [menuOpen])

  const handleLinkClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }, menuOpen ? 500 : 0)
  }

  return (
    <>
      <div className={styles.navWrap}>
      <nav ref={navRef} className={styles.nav}>
        <a href="#" className={styles.logoWrap}>
          <img ref={logoRef} src={logo} alt="YE Logo" className={styles.logo} />
        </a>

        <ul className={styles.links}>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} className={styles.link} onClick={e => handleLinkClick(e, href)}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>
      </div>

      {/* Mobile overlay */}
      <div ref={overlayRef} className={styles.overlay}>
        <button className={styles.closeBtn} onClick={() => setMenuOpen(false)}>×</button>
        <ul className={styles.overlayLinks}>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className={styles.overlayLink}
                onClick={e => handleLinkClick(e, href)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
