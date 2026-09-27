import { useState, useEffect, useRef, useCallback } from 'react'
import { sfx } from '../utils/sfx'

export interface LightboxItem {
  src: string
  type?: 'image' | 'video' | 'youtube'
  caption?: string
  poster?: string
}

interface LightboxProps {
  items: LightboxItem[]
  index: number
  onClose: () => void
}

export default function Lightbox({ items, index, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(index)
  const [zoomed, setZoomed] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % items.length)
    setZoomed(false)
    sfx.click()
  }, [items.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + items.length) % items.length)
    setZoomed(false)
    sfx.click()
  }, [items.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [next, prev, onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const item = items[current]

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) next()
      else prev()
    }
    touchStartX.current = 0
    touchEndX.current = 0
  }

  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-950/95 backdrop-blur-md"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center border-2 border-neon-pink/60 text-neon-pink font-pixel text-lg transition-all hover:bg-neon-pink/10 hover:shadow-[0_0_12px_rgba(244,114,182,0.4)] active:scale-90"
        style={{ borderRadius: '2px' }}
        aria-label="Close"
      >
        {'\u2715'}
      </button>

      {/* Counter */}
      {items.length > 1 && (
        <div className="absolute top-4 left-4 z-10 font-pixel text-[8px] text-neon-sky/60 uppercase tracking-wider">
          {current + 1} / {items.length}
        </div>
      )}

      {/* Content */}
      <div
        className="relative max-w-[90vw] max-h-[75vh] flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation()
          if (item.type === 'image' || (!item.type)) {
            setZoomed((z) => !z)
            sfx.pop()
          }
        }}
      >
        <div
          className="transition-transform duration-300"
          style={{
            transform: zoomed ? 'scale(1.8)' : 'scale(1)',
            cursor: item.type === 'image' || !item.type ? 'zoom-in' : 'default',
          }}
        >
          {/* Corner brackets */}
          <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-sky z-10 pointer-events-none" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neon-sky z-10 pointer-events-none" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neon-sky z-10 pointer-events-none" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-sky z-10 pointer-events-none" />

          {item.type === 'youtube' && (() => {
            const videoId = extractYouTubeId(item.src)
            if (!videoId) return null
            return (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={item.caption || 'Video'}
                className="w-[80vw] aspect-video max-w-[800px]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 'none' }}
              />
            )
          })()}

          {item.type === 'video' && (
            <video
              src={item.src}
              poster={item.poster}
              controls
              className="max-w-[80vw] max-h-[75vh] object-contain"
            />
          )}

          {(!item.type || item.type === 'image') && (
            <img
              src={item.src}
              alt={item.caption || ''}
              className="max-w-[80vw] max-h-[75vh] object-contain"
              draggable={false}
            />
          )}
        </div>
      </div>

      {/* Caption */}
      {item.caption && (
        <div className="mt-4 px-4 text-center max-w-[80vw]">
          <div className="font-pixel text-[8px] sm:text-[10px] text-neon-sky/80 uppercase tracking-wider">
            {item.caption}
          </div>
        </div>
      )}

      {/* Nav arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center border-2 border-neon-blue/50 text-neon-sky font-pixel text-sm transition-all hover:bg-neon-blue/10 hover:shadow-[0_0_12px_rgba(37,99,235,0.4)] active:scale-90"
            style={{ borderRadius: '2px' }}
            aria-label="Previous"
          >
            {'\u25C0'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center border-2 border-neon-blue/50 text-neon-sky font-pixel text-sm transition-all hover:bg-neon-blue/10 hover:shadow-[0_0_12px_rgba(37,99,235,0.4)] active:scale-90"
            style={{ borderRadius: '2px' }}
            aria-label="Next"
          >
            {'\u25B6'}
          </button>
        </>
      )}

      {/* Zoom hint for images */}
      {(!item.type || item.type === 'image') && !zoomed && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-pixel text-[6px] text-neon-sky/40 uppercase tracking-wider">
          tap to zoom {'\u00B7'} swipe to navigate {'\u00B7'} esc to close
        </div>
      )}
    </div>
  )
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]+)/,
    /(?:youtu\.be\/)([\w-]+)/,
    /(?:youtube\.com\/embed\/)([\w-]+)/,
  ]
  for (const p of patterns) {
    const match = url.match(p)
    if (match) return match[1]
  }
  return null
}
