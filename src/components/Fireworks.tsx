import { useRef, useEffect, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  color: string
  size: number
  life: number
  maxLife: number
}

interface Rocket {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  trail: { x: number; y: number; alpha: number }[]
  exploded: boolean
}

const COLORS = ['#38bdf8', '#f472b6', '#fbbf24', '#34d399', '#a78bfa', '#fb7185']

interface FireworksProps {
  active: boolean
  onTap?: () => void
}

export default function Fireworks({ active, onTap }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rocketsRef = useRef<Rocket[]>([])
  const rafRef = useRef<number>(0)
  const lastLaunchRef = useRef(0)

  const launch = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const x = canvas.width * (0.2 + Math.random() * 0.6)
    const targetY = canvas.height * (0.15 + Math.random() * 0.35)
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    rocketsRef.current.push({
      x,
      y: canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -((canvas.height - targetY) / 60),
      color,
      trail: [],
      exploded: false,
    })
  }, [])

  const explode = useCallback((rx: number, ry: number, color: string) => {
    const count = 40 + Math.floor(Math.random() * 20)
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = 2 + Math.random() * 4
      particlesRef.current.push({
        x: rx,
        y: ry,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        size: 2 + Math.random() * 2,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      })
    }
  }, [])

  const handleClick = useCallback(() => {
    if (!active) return
    launch()
    onTap?.()
  }, [active, launch, onTap])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Auto-launch when active
      if (active && Date.now() - lastLaunchRef.current > 800 + Math.random() * 1200) {
        lastLaunchRef.current = Date.now()
        launch()
      }

      // Update rockets
      rocketsRef.current = rocketsRef.current.filter((r) => {
        if (r.exploded) return false
        r.trail.push({ x: r.x, y: r.y, alpha: 1 })
        if (r.trail.length > 12) r.trail.shift()
        r.x += r.vx
        r.y += r.vy
        r.vy += 0.05

        if (r.vy >= 0) {
          explode(r.x, r.y, r.color)
          return false
        }

        // Draw trail
        r.trail.forEach((t, i) => {
          ctx.fillStyle = r.color
          ctx.globalAlpha = (i / r.trail.length) * 0.6
          ctx.fillRect(t.x - 1, t.y - 1, 2, 2)
        })
        ctx.globalAlpha = 1
        return true
      })

      // Update particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.04
        p.vx *= 0.99
        p.alpha = 1 - p.life / p.maxLife
        if (p.alpha <= 0) return false

        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
        ctx.globalAlpha = 1
        return true
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [active, launch, explode])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="fixed inset-0 z-30 pointer-events-auto"
      style={{ touchAction: 'manipulation' }}
      aria-label="Tap for fireworks"
    />
  )
}
