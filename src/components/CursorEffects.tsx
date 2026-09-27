import { useEffect } from 'react'

export default function CursorEffects() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches

    if (prefersReduced) return

    let sparkTimer: number | undefined

    // Desktop: cursor spark trail
    if (!isTouchDevice) {
      const handleMouseMove = (e: MouseEvent) => {
        const particle = document.createElement('div')
        particle.className = 'spark-particle'
        particle.style.left = `${e.clientX}px`
        particle.style.top = `${e.clientY}px`
        particle.style.background = Math.random() > 0.5 ? '#38bdf8' : '#f472b6'
        particle.style.boxShadow = '0 0 6px currentColor'
        document.body.appendChild(particle)
        setTimeout(() => particle.remove(), 800)
      }

      let throttle = false
      const throttledMove = (e: MouseEvent) => {
        if (throttle) return
        throttle = true
        handleMouseMove(e)
        sparkTimer = window.setTimeout(() => { throttle = false }, 40)
      }

      window.addEventListener('mousemove', throttledMove)
      return () => {
        window.removeEventListener('mousemove', throttledMove)
        if (sparkTimer) clearTimeout(sparkTimer)
      }
    }

    // Mobile: tap ripples
    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      const ripple = document.createElement('div')
      ripple.className = 'tap-ripple'
      ripple.style.left = `${touch.clientX}px`
      ripple.style.top = `${touch.clientY}px`
      document.body.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)
    }

    window.addEventListener('touchstart', handleTouch)
    return () => {
      window.removeEventListener('touchstart', handleTouch)
      if (sparkTimer) clearTimeout(sparkTimer)
    }
  }, [])

  return null
}
