import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
    alpha: number
    alphaSpeed: number
}

const COLORS = ['#38bdf8', '#f472b6', '#60a5fa']

export default function ParticlesBackground() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animId: number

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        const particleCount = 55
        const particles: Particle[] = Array.from({ length: particleCount }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7,
            size: Math.random() * 2 + 1.2,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            alpha: Math.random() * 0.6 + 0.2,
            alphaSpeed: (Math.random() * 0.01 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
        }))

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // 1. Draw glowing constellation connection lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const dist = Math.hypot(dx, dy)

                    if (dist < 115) {
                        ctx.save()
                        ctx.beginPath()
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.strokeStyle = '#38bdf8'
                        ctx.globalAlpha = (1 - dist / 115) * 0.2
                        ctx.lineWidth = 0.8
                        ctx.stroke()
                        ctx.restore()
                    }
                }
            }

            // 2. Render and animate particles
            for (const p of particles) {
                p.x += p.vx
                p.y += p.vy
                p.alpha += p.alphaSpeed

                // Wrap around boundaries
                if (p.x < 0) p.x = canvas.width
                if (p.x > canvas.width) p.x = 0
                if (p.y < 0) p.y = canvas.height
                if (p.y > canvas.height) p.y = 0

                if (p.alpha <= 0.2 || p.alpha >= 0.8) {
                    p.alphaSpeed = -p.alphaSpeed
                }

                ctx.save()
                ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha))
                ctx.fillStyle = p.color
                ctx.shadowColor = p.color
                ctx.shadowBlur = 6
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
                ctx.restore()
            }

            animId = requestAnimationFrame(render)
        }

        render()

        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 w-full h-full"
            style={{ imageRendering: 'pixelated' }}
        />
    )
}