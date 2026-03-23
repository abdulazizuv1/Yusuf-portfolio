import { useRef } from 'react'
import { gsap } from 'gsap'
import styles from './ChampionshipCard.module.css'

const POSITION_EMOJI = { 1: '🥇', 2: '🥈', 3: '🥉' }

function posLabel(pos) {
  const emoji = POSITION_EMOJI[pos] || ''
  return `${emoji} P${pos}`
}

export default function ChampionshipCard({ championship, onClick }) {
  const cardRef  = useRef(null)
  const imgRef   = useRef(null)
  const overlayRef = useRef(null)

  const handleEnter = () => {
    gsap.to(cardRef.current,  { y: -12, boxShadow: '0 20px 60px var(--red-glow)', duration: 0.3, ease: 'power2.out' })
    gsap.to(imgRef.current,   { scale: 1.05, duration: 0.3, ease: 'power2.out' })
    gsap.to(overlayRef.current, { opacity: 0.2, duration: 0.3 })
  }

  const handleLeave = () => {
    gsap.to(cardRef.current,  { y: 0, boxShadow: 'none', duration: 0.3, ease: 'power2.out' })
    gsap.to(imgRef.current,   { scale: 1, duration: 0.3, ease: 'power2.out' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 })
  }

  return (
    <article
      ref={cardRef}
      className={styles.card}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={() => onClick(championship)}
    >
      <div className={styles.imgWrap}>
        {championship.coverPhoto
          ? <img ref={imgRef} src={championship.coverPhoto} alt={championship.name} className={styles.img} loading="lazy" />
          : <div ref={imgRef} className={styles.imgPlaceholder} />
        }
        <div ref={overlayRef} className={styles.imgOverlay} />
        <div className={styles.gradient} />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{championship.name}</h3>
        <p className={styles.year}>{championship.year}</p>
        <div className={styles.badges}>
          <span className={styles.lapBadge}>⏱ {championship.bestLapTime}</span>
          <span className={styles.posBadge}>{posLabel(championship.position)}</span>
        </div>
        <span className={styles.cta}>VIEW DETAILS →</span>
      </div>
    </article>
  )
}
