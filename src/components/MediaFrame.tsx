import { useState, useEffect, useRef, type ReactNode } from 'react'

interface MediaFrameProps {
  src: string
  type?: 'image' | 'video' | 'youtube'
  poster?: string
  alt?: string
  className?: string
  children?: ReactNode
}

export default function MediaFrame({
  src,
  type = 'image',
  poster,
  alt,
  className = '',
  children,
}: MediaFrameProps) {
  const [errored, setErrored] = useState(false)
  const [visible, setVisible] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setErrored(false)
    setVisible(false)
  }, [src, poster])

  const fileName = src.split('/').pop() || src

  const PlaceholderBox = () => (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed border-neon-pink/40 bg-navy-800/40 w-full h-full ${className}`}
    >
      <span className="font-pixel text-[8px] text-neon-pink/60 uppercase tracking-widest mb-2">
        Add Media Here
      </span>
      <span className="font-pixel text-[6px] text-soft/40 text-center px-2 break-all">
        {fileName}
      </span>
    </div>
  )

  // Corner brackets wrapper
  const withFrame = (content: ReactNode) => (
    <div
      className={`relative border-2 border-neon-blue/30 bg-navy-800/60 overflow-hidden ${className}`}
      style={{ borderRadius: '2px' }}
    >
      <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-neon-sky z-10 pointer-events-none" />
      <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-neon-sky z-10 pointer-events-none" />
      <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-neon-sky z-10 pointer-events-none" />
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-neon-sky z-10 pointer-events-none" />
      {content}
      {children}
    </div>
  )

  if (!src || errored) {
    return withFrame(<PlaceholderBox />)
  }

  if (type === 'youtube') {
    const videoId = extractYouTubeId(src)
    if (!videoId) return withFrame(<PlaceholderBox />)
    return withFrame(
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={alt || 'YouTube video'}
        className="w-full aspect-video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ border: 'none' }}
      />,
    )
  }

  if (type === 'video') {
    return withFrame(
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        className="w-full aspect-video object-cover"
        onError={() => setErrored(true)}
        onLoadedData={() => setVisible(true)}
      />,
    )
  }

  // image
  return withFrame(
    <>
      <img
        ref={imgRef}
        src={src}
        alt={alt || fileName}
        className="w-full h-full object-cover"
        onError={() => setErrored(true)}
        onLoad={() => setVisible(true)}
      />
      {!visible && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-pixel text-[8px] text-neon-sky/50">
            <span className="cursor-blink">▌</span>
          </span>
        </div>
      )}
    </>,
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
