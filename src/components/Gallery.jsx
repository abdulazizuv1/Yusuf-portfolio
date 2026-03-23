import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { getGalleryPhotos, getQuotes } from '../firebase/gallery'
import { PhotoItem, QuoteItem } from './GalleryItem'
import styles from './Gallery.module.css'

gsap.registerPlugin(ScrollTrigger)

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

// Interleave quotes between photos: insert a quote after every 3rd photo
function buildItems(photos, quotes) {
  if (photos.length === 0 && quotes.length === 0) return null // use fallback

  const items = []
  let qi = 0
  photos.forEach((p, i) => {
    items.push({ type: 'photo', ...p, rotation: i % 2 === 0 ? -1 : 1 })
    if ((i + 1) % 3 === 0 && qi < quotes.length) {
      items.push({ type: 'quote', ...quotes[qi++] })
    }
  })
  // append remaining quotes at the end
  while (qi < quotes.length) {
    items.push({ type: 'quote', ...quotes[qi++] })
  }
  return items
}

const FALLBACK = [
  { type: 'photo', url: 'https://picsum.photos/seed/k1/800/600', caption: 'Regional Championship 2024', rotation: -1 },
  { type: 'quote', quote: "The kart doesn't lie — only the stopwatch tells the truth.", attribution: 'Yusuf Usmanov' },
  { type: 'photo', url: 'https://picsum.photos/seed/k2/800/600', caption: 'Podium Finish — 2023', rotation: 1 },
  { type: 'photo', url: 'https://picsum.photos/seed/k3/800/600', caption: 'Pre-race prep', rotation: -1.5 },
  { type: 'quote', quote: 'Every corner is a chance to find something others missed.', attribution: 'Yusuf Usmanov' },
  { type: 'photo', url: 'https://picsum.photos/seed/k4/800/600', caption: 'Championship celebration', rotation: 1 },
]

export default function Gallery() {
  const sectionRef = useRef(null)
  const trackRef   = useRef(null)
  const titleRef   = useRef(null)

  const [photos, setPhotos] = useState([])
  const [quotes, setQuotes] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([getGalleryPhotos(), getQuotes()])
      .then(([p, q]) => { setPhotos(p); setQuotes(q) })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const items = loaded ? (buildItems(photos, quotes) ?? FALLBACK) : FALLBACK

  useEffect(() => {
    if (isMobile()) return
    const track   = trackRef.current
    const section = sectionRef.current
    if (!track || !section) return

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        clipPath: 'inset(0 100% 0 0)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
      })

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 120),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${track.scrollWidth}`,
          invalidateOnRefresh: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [items.length])

  return (
    <section ref={sectionRef} id="gallery" className={styles.section}>
      <div className={styles.titleRow}>
        <h2 ref={titleRef} className={styles.title}>GALLERY</h2>
        <div className={styles.line} />
      </div>

      {/* Desktop: GSAP horizontal scroll */}
      <div className={`${styles.desktopTrackWrap} ${styles.desktopOnly}`}>
        <div ref={trackRef} className={styles.track}>
          {items.map((item, i) =>
            item.type === 'photo' ? (
              <PhotoItem key={i} url={item.url} caption={item.caption} rotation={item.rotation} />
            ) : (
              <QuoteItem key={i} quote={item.quote} attribution={item.attribution} />
            )
          )}
        </div>
      </div>

      {/* Mobile: Swiper carousel */}
      <div className={styles.mobileOnly}>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={0}
          className={styles.swiper}
        >
          {items.map((item, i) => (
            <SwiperSlide key={i} className={styles.slide}>
              {item.type === 'photo' ? (
                <PhotoItem url={item.url} caption={item.caption} rotation={0} />
              ) : (
                <QuoteItem quote={item.quote} attribution={item.attribution} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
