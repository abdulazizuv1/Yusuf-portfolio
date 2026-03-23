import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fade + slide element into view on scroll.
 * Returns a ref to attach to the element.
 */
export function useScrollFadeIn(options = {}) {
  const ref = useRef(null)
  const { y = 40, duration = 0.7, start = 'top 85%', delay = 0 } = options

  useEffect(() => {
    if (!ref.current) return
    gsap.from(ref.current, {
      y,
      opacity: 0,
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start,
        once: true,
      },
    })
  }, [])

  return ref
}

/**
 * Clip-path reveal from left on scroll.
 */
export function useClipReveal(options = {}) {
  const ref = useRef(null)
  const { duration = 1, start = 'top 85%' } = options

  useEffect(() => {
    if (!ref.current) return
    gsap.from(ref.current, {
      clipPath: 'inset(0 100% 0 0)',
      duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ref.current,
        start,
        once: true,
      },
    })
  }, [])

  return ref
}
