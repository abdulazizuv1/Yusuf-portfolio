import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './AnimatedBackground.module.css'

// Large organic blob outlines — like landonorris.com
const SHAPES = [
  // Large blobs
  { x: '-5%',  y: '2%',   d: 'M160,0 C260,0 320,80 320,200 C320,340 260,420 160,420 C60,420 0,340 0,200 C0,80 60,0 160,0 Z',   w: 320, h: 420 },
  { x: '72%',  y: '-4%',  d: 'M140,0 C230,0 280,70 280,180 C280,310 220,380 130,380 C40,380 0,310 0,200 C0,80 50,0 140,0 Z',    w: 280, h: 380 },
  { x: '40%',  y: '30%',  d: 'M200,0 C320,10 400,100 390,240 C380,380 290,460 170,450 C50,440 -20,350 10,210 C40,70 80,-10 200,0 Z', w: 400, h: 460 },
  { x: '-8%',  y: '55%',  d: 'M130,0 C210,0 260,60 260,160 C260,280 200,340 110,340 C20,340 0,270 0,170 C0,70 50,0 130,0 Z',    w: 260, h: 340 },
  { x: '78%',  y: '50%',  d: 'M170,0 C280,0 340,90 330,230 C320,370 240,440 140,440 C30,440 -10,360 0,220 C10,80 60,0 170,0 Z',  w: 340, h: 440 },
  { x: '20%',  y: '70%',  d: 'M150,0 C240,0 300,70 290,190 C280,320 200,380 110,370 C20,360 -20,280 10,160 C40,40 60,0 150,0 Z', w: 300, h: 380 },
  { x: '55%',  y: '68%',  d: 'M120,0 C200,0 250,65 240,175 C230,290 165,350 90,340 C15,330 -10,260 5,150 C20,40 40,0 120,0 Z',   w: 250, h: 350 },
  // Medium blobs
  { x: '10%',  y: '25%',  d: 'M90,0 C150,0 190,50 185,130 C180,220 130,260 70,250 C10,240 -10,180 5,100 C20,20 30,0 90,0 Z',     w: 190, h: 260 },
  { x: '85%',  y: '22%',  d: 'M80,0 C135,0 165,45 160,120 C155,200 110,235 60,225 C10,215 -5,160 5,90 C15,20 25,0 80,0 Z',       w: 165, h: 235 },
  { x: '32%',  y: '8%',   d: 'M100,0 C165,0 200,55 195,145 C190,235 140,275 80,265 C20,255 0,195 10,110 C20,25 35,0 100,0 Z',     w: 200, h: 275 },
  { x: '62%',  y: '15%',  d: 'M75,0 C125,0 155,40 150,110 C145,185 100,215 55,207 C10,199 -5,150 5,82 C15,14 25,0 75,0 Z',        w: 155, h: 215 },
  { x: '5%',   y: '80%',  d: 'M85,0 C140,0 175,48 170,128 C165,213 115,250 65,240 C15,230 -5,172 5,95 C15,18 30,0 85,0 Z',        w: 175, h: 250 },
  // Wavy lines across
  { x: '-2%',  y: '14%',  d: 'M0,60 C120,-20 280,160 460,60 C640,-20 780,130 960,60',  w: 960, h: 160, line: true },
  { x: '5%',   y: '45%',  d: 'M0,70 C140,0  320,180 520,70 C720,-10 880,160 1060,70',  w: 1060, h: 180, line: true },
  { x: '-4%',  y: '78%',  d: 'M0,50 C110,130 260,-10 420,50 C580,110 720,10 900,50',   w: 900, h: 140, line: true },
]

function ShapeEl({ shape }) {
  const style = {
    position: 'absolute',
    left: shape.x,
    top: shape.y,
    opacity: shape.line ? 0.22 : 0.18,
    pointerEvents: 'none',
    overflow: 'visible',
  }

  return (
    <svg
      className="bg-shape"
      style={style}
      width={shape.w}
      height={shape.h}
      viewBox={`0 0 ${shape.w} ${shape.h}`}
      fill="none"
    >
      <path
        d={shape.d}
        stroke="#999"
        strokeWidth={shape.line ? '1.5' : '1.2'}
        fill={shape.line ? 'none' : 'rgba(160,160,160,0.03)'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function AnimatedBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    const shapes = containerRef.current.querySelectorAll('.bg-shape')
    shapes.forEach((shape, i) => {
      gsap.to(shape, {
        x: `random(-80, 80)`,
        y: `random(-60, 60)`,
        rotation: `random(-12, 12)`,
        opacity: `random(0.15, 0.28)`,
        duration: `random(7, 13)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.4,
      })
    })
  }, [])

  return (
    <div ref={containerRef} className={styles.background}>
      {SHAPES.map((shape, i) => (
        <ShapeEl key={i} shape={shape} />
      ))}
    </div>
  )
}
