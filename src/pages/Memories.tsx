import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Sprite from '../components/Sprite'
import MediaFrame from '../components/MediaFrame'
import PixelButton from '../components/PixelButton'
import Lightbox, { type LightboxItem } from '../components/Lightbox'
import { useBuddy } from '../context/BuddyContext'
import { useXP } from '../context/XPContext'
import { memories, dialogue } from '../config.js'
import { sfx } from '../utils/sfx'

export default function Memories() {
  const navigate = useNavigate()
  const { say } = useBuddy()
  const { completeLevel } = useXP()
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [reachedEnd, setReachedEnd] = useState(false)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const dialogueShownRef = useRef(false)

  // Buddy sit pose with smile face
  useEffect(() => {
    if (dialogueShownRef.current) return
    dialogueShownRef.current = true
    const mem = dialogue.memories
    if (mem) {
      say(mem.pose, mem.text, mem.face)
    }
  }, [say])

  // Scroll reveal via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index)
            setVisibleItems((prev) => new Set(prev).add(idx))
          }
        })
      },
      { threshold: 0.25 }
    )

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Detect scroll to bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      if (scrollY >= docHeight - 100 && !reachedEnd) {
        setReachedEnd(true)
        completeLevel('memories')
        sfx.success()
        say('happy', 'You have reached the end of our memories!', 'smile')
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [reachedEnd, completeLevel, say])

  // Build lightbox items (only images)
  const lightboxItems: LightboxItem[] = memories
    .filter((m) => m.type === 'image')
    .map((m) => ({ src: m.src, caption: `${m.date} - ${m.title}`, type: 'image' as const }))

  const openLightbox = (memoryIndex: number) => {
    const imageMemories = memories
      .map((m, i) => ({ ...m, i }))
      .filter((m) => m.type === 'image')
    const lbIdx = imageMemories.findIndex((m) => m.i === memoryIndex)
    if (lbIdx >= 0) {
      sfx.pop()
      setLightboxIndex(lbIdx)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mt-4 pb-12">
      {/* Header */}
      <div className="text-center">
        <div className="font-pixel text-[8px] text-neon-pink uppercase tracking-widest mb-3">
          {'\u25C6'} Memory Vault {'\u25C6'}
        </div>
        <h1 className="font-pixel text-sm sm:text-base text-soft uppercase tracking-widest">
          Our Timeline
        </h1>
      </div>

      {/* Buddy */}
      <div className="flex justify-center">
        <Sprite name="sit" kind="poses" scale={3} />
      </div>

      {/* Timeline */}
      <div className="relative w-full">
        {/* Vertical line */}
        <div
          className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-neon-blue/30 sm:-translate-x-1/2"
          aria-hidden
        />

        {memories.map((mem, i) => {
          const isLeft = i % 2 === 0
          const isVisible = visibleItems.has(i)
          const isImage = mem.type === 'image'

          return (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el }}
              data-index={i}
              className={`relative flex ${isLeft ? 'sm:justify-start' : 'sm:justify-end'} mb-8 transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-4 sm:left-1/2 top-6 w-3 h-3 rounded-full border-2 border-neon-sky bg-navy-900 sm:-translate-x-1/2 z-10 ${
                  isVisible ? 'shadow-[0_0_8px_rgba(56,189,248,0.5)]' : ''
                }`}
                aria-hidden
              />

              {/* Card */}
              <div
                className={`ml-12 sm:ml-0 sm:w-[calc(50%-2rem)] ${
                  isLeft ? 'sm:mr-auto' : 'sm:ml-auto'
                }`}
              >
                <div
                  className="relative bg-navy-800/60 backdrop-blur-sm border border-neon-blue/40 p-4"
                  style={{ borderRadius: '2px' }}
                >
                  {/* Corner brackets */}
                  <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-neon-sky pointer-events-none" />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-neon-sky pointer-events-none" />
                  <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-neon-sky pointer-events-none" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-neon-sky pointer-events-none" />

                  {/* Date */}
                  <div className="font-pixel text-[8px] text-neon-pink/70 uppercase tracking-widest mb-2">
                    {mem.date}
                  </div>

                  {/* Title */}
                  <h2 className="font-pixel text-[10px] sm:text-xs text-neon-sky uppercase tracking-wider mb-3">
                    {mem.title}
                  </h2>

                  {/* Media */}
                  <div
                    className={`mb-3 ${isImage ? 'cursor-pointer' : ''}`}
                    onClick={() => isImage && openLightbox(i)}
                  >
                    <MediaFrame
                      src={mem.src}
                      type={mem.type === 'video' ? 'video' : 'image'}
                      alt={mem.title}
                      className="aspect-video"
                    />
                    {isImage && (
                      <div className="font-pixel text-[6px] text-neon-sky/40 uppercase tracking-wider text-center mt-1">
                        tap to zoom
                      </div>
                    )}
                  </div>

                  {/* Story */}
                  <p className="font-body text-sm text-soft/60 leading-relaxed">
                    {mem.story}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* End marker */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <div className="font-pixel text-[8px] text-neon-sky/50 uppercase tracking-widest">
          {'\u25C6'} End of Timeline {'\u25C6'}
        </div>
        {reachedEnd && (
          <PixelButton variant="blue" size="md" onClick={() => navigate('/gallery')}>
            Continue to Gallery {'\u2192'}
          </PixelButton>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={lightboxItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}
