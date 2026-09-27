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
  trail: { x: number; y: number }[]
  exploded: boolean
}

const COLORS = ['#38bdf8', '#f472b6', '#fbbf24', '#34d399', '#a78bfa', '#fb7185', '#ffffff']

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

  const launch = useCallback((targetX?: number, targetY?: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const x = targetX ?? canvas.width * (0.15 + Math.random() * 0.7)
    const destY = targetY ?? canvas.height * (0.12 + Math.random() * 0.38)
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]

    rocketsRef.current.push({
      x,
      y: canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -((canvas.height - destY) / 45),
      color,
      trail: [],
      exploded: false,
    })
  }, [])

  const explode = useCallback((rx: number, ry: number, color: string) => {
    const count = 45 + Math.floor(Math.random() * 25)
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = 2.5 + Math.random() * 4.5
      particlesRef.current.push({
        x: rx,
        y: ry,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        size: Math.random() > 0.5 ? 4 : 3,
        life: 0,
        maxLife: 55 + Math.random() * 35,
      })
    }
  }, [])

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!active) return
    const rect = e.currentTarget.getBoundingClientRect()
    explode(e.clientX - rect.left, e.clientY - rect.top, COLORS[Math.floor(Math.random() * COLORS.length)])
    onTap?.()
  }, [active, explode, onTap])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (active && Date.now() - lastLaunchRef.current > 550 + Math.random() * 600) {
        lastLaunchRef.current = Date.now()
        launch()
      }

      rocketsRef.current = rocketsRef.current.filter((r) => {
        if (r.exploded) return false
        r.trail.push({ x: r.x, y: r.y })
        if (r.trail.length > 8) r.trail.shift()
        r.x += r.vx
        r.y += r.vy
        r.vy += 0.09

        if (r.vy >= 0) {
          explode(r.x, r.y, r.color)
          return false
        }

        r.trail.forEach((t, i) => {
          ctx.fillStyle = r.color
          ctx.globalAlpha = (i / r.trail.length) * 0.7
          ctx.fillRect(Math.floor(t.x), Math.floor(t.y), 2, 2)
        })
        ctx.globalAlpha = 1
        return true
      })

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.06
        p.vx *= 0.98
        p.alpha = 1 - p.life / p.maxLife
        if (p.alpha <= 0) return false

        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size)
        ctx.globalAlpha = 1
        return true
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

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
      className="fixed inset-0 w-screen h-screen z-50 pointer-events-auto"
      style={{ touchAction: 'manipulation' }}
    />
  )
}