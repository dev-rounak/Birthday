import { useRef, useEffect } from 'react'

interface ConfettiPiece {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  color: string
  size: number
  shape: 'square' | 'rect' | 'circle'
  alpha: number
  life: number
  maxLife: number
}

const COLORS = ['#38bdf8', '#f472b6', '#fbbf24', '#34d399', '#a78bfa', '#fb7185', '#f8fafc']

interface ConfettiProps {
  active: boolean
}

export default function Confetti({ active }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const piecesRef = useRef<ConfettiPiece[]>([])
  const rafRef = useRef<number>(0)

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

    const spawn = () => {
      const count = 5
      for (let i = 0; i < count; i++) {
        piecesRef.current.push({
          x: Math.random() * canvas.width,
          y: -10,
          vx: (Math.random() - 0.5) * 3,
          vy: 2 + Math.random() * 3,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 4 + Math.random() * 6,
          shape: ['square', 'rect', 'circle'][Math.floor(Math.random() * 3)] as 'square' | 'rect' | 'circle',
          alpha: 1,
          life: 0,
          maxLife: 200 + Math.random() * 100,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (active && piecesRef.current.length < 150) {
        spawn()
      }

      piecesRef.current = piecesRef.current.filter((p) => {
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.05
        p.rotation += p.rotationSpeed
        p.alpha = Math.max(0, 1 - p.life / p.maxLife)
        if (p.alpha <= 0 || p.y > canvas.height + 20) return false

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        }
        ctx.restore()
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
      piecesRef.current = []
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-30 pointer-events-none"
    />
  )
}
