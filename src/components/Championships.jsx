import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useChampionships } from '../hooks/useChampionships'
import ChampionshipCard from './ChampionshipCard'
import ChampionshipModal from './ChampionshipModal'
import styles from './Championships.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Championships() {
  const { championships, loading } = useChampionships()
  const [selected, setSelected] = useState(null)
  const gridRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    if (loading || championships.length === 0) return

    // Title reveal
    gsap.from(titleRef.current, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 85%',
      },
    })

    // Cards stagger
    const cards = gridRef.current.querySelectorAll('article')
    gsap.from(cards, {
      y: 60,
      opacity: 0,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 80%',
        invalidateOnRefresh: true,
      },
    })
  }, [loading, championships])

  return (
    <section id="championships" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2 ref={titleRef} className={styles.title}>CHAMPIONSHIPS</h2>
          <div className={styles.line} />
        </div>
        <p className={styles.subtitle}>"A history written in lap times"</p>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <span className={styles.spinner} />
        </div>
      ) : championships.length === 0 ? (
        <p className={styles.empty}>No championships added yet.</p>
      ) : (
        <div ref={gridRef} className={styles.grid}>
          {championships.map(c => (
            <ChampionshipCard key={c.id} championship={c} onClick={setSelected} />
          ))}
        </div>
      )}

      <ChampionshipModal championship={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
