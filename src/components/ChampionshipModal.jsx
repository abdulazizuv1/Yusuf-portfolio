import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import styles from './ChampionshipModal.module.css'

export default function ChampionshipModal({ championship, onClose }) {
  const overlayRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (!championship) return

    const tl = gsap.timeline()
    gsap.set(overlayRef.current, { opacity: 0, display: 'flex' })
    gsap.set(contentRef.current, { y: 60, opacity: 0 })

    tl.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      .to(contentRef.current, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }, '-=0.1')

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [championship])

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(contentRef.current, { y: 60, opacity: 0, duration: 0.3, ease: 'power2.in' })
      .to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.1')
  }

  if (!championship) return null

  const { name, year, track, position, bestLapTime, totalLaps, description, coverPhoto, photos = [] } = championship
  const allPhotos = [coverPhoto, ...photos].filter(Boolean)

  return (
    <div ref={overlayRef} className={styles.overlay} onClick={e => e.target === overlayRef.current && handleClose()}>
      <div ref={contentRef} className={styles.content}>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">×</button>

        {coverPhoto && (
          <div className={styles.heroImg}>
            <img src={coverPhoto} alt={name} />
          </div>
        )}

        <div className={styles.body}>
          <h2 className={styles.title}>{name}</h2>

          <div className={styles.details}>
            <div className={styles.detail}><span>YEAR</span><strong>{year}</strong></div>
            <div className={styles.detail}><span>TRACK</span><strong>{track}</strong></div>
            <div className={styles.detail}><span>POSITION</span><strong>P{position}</strong></div>
            <div className={styles.detail}><span>BEST LAP</span><strong>{bestLapTime}</strong></div>
            <div className={styles.detail}><span>TOTAL LAPS</span><strong>{totalLaps}</strong></div>
          </div>

          {description && <p className={styles.description}>{description}</p>}

          {allPhotos.length > 0 && (
            <div className={styles.carousel}>
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={16}
                slidesPerView={1}
              >
                {allPhotos.map((url, i) => (
                  <SwiperSlide key={i}>
                    <img src={url} alt={`${name} photo ${i + 1}`} className={styles.slideImg} loading="lazy" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
