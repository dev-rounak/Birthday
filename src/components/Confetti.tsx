import { useEffect, useRef } from 'react'

interface ConfettiPiece {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  rotSpeed: number
}

const PALETTE = ['#38bdf8', '#f472b6', '#2563eb', '#fbcfe8', '#ffffff', '#fbbf24']

interface ConfettiProps {
  active?: boolean
}

export default function Confetti({ active = true }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const pieces: ConfettiPiece[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 2.5 + 2,
      size: Math.floor(Math.random() * 4) + 4,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.1,
    }))

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of pieces) {
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotSpeed

        if (p.y > canvas.height) {
          p.y = -10
          p.x = Math.random() * canvas.width
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-30"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}