import { useRef } from 'react'
import { gsap } from 'gsap'
import styles from './GalleryItem.module.css'

export function PhotoItem({ url, caption, rotation = 0 }) {
  const wrapRef    = useRef(null)
  const captionRef = useRef(null)

  const handleEnter = () => {
    gsap.to(wrapRef.current,    { scale: 1.05, rotation: 0, duration: 0.35, ease: 'power2.out' })
    gsap.to(captionRef.current, { y: 0, duration: 0.3, ease: 'power2.out' })
  }
  const handleLeave = () => {
    gsap.to(wrapRef.current,    { scale: 1, rotation, duration: 0.35, ease: 'power2.out' })
    gsap.to(captionRef.current, { y: '100%', duration: 0.3, ease: 'power2.in' })
  }

  return (
    <div
      ref={wrapRef}
      className={styles.photoWrap}
      style={{ transform: `rotate(${rotation}deg)` }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <img src={url} alt={caption} className={styles.photo} loading="lazy" />
      <div className={styles.captionBar} ref={captionRef}>{caption}</div>
    </div>
  )
}

export function QuoteItem({ quote, attribution }) {
  return (
    <div className={styles.quoteCard}>
      <span className={styles.quoteMark}>"</span>
      <p className={styles.quoteText}>{quote}</p>
      <p className={styles.attribution}>— {attribution}</p>
    </div>
  )
}
