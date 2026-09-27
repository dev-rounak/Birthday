import { useState, useEffect } from 'react'
import { character } from '../config.js'

type SpriteKind = 'poses' | 'faces' | 'props'

interface SpriteProps {
  name: string
  kind: SpriteKind
  scale?: number
  alt?: string
  className?: string
}

export default function Sprite({ name, kind, scale = 3, alt, className = '' }: SpriteProps) {
  const [errored, setErrored] = useState(false)
  const [exists, setExists] = useState(true)

  const path = character[kind]?.[name] as string | undefined

  useEffect(() => {
    setErrored(false)
    setExists(true)
  }, [path])

  if (!path) {
    return (
      <div
        className={`inline-flex flex-col items-center justify-center border-2 border-dashed border-neon-blue/40 bg-navy-800/40 ${className}`}
        style={{
          width: 64 * scale,
          height: 64 * scale,
          imageRendering: 'pixelated',
        }}
      >
        <span className="font-pixel text-[6px] text-neon-pink/70 text-center px-1 break-all">
          {name}.png
        </span>
      </div>
    )
  }

  if (errored || !exists) {
    return (
      <div
        className={`inline-flex flex-col items-center justify-center border-2 border-dashed border-neon-pink/40 bg-navy-800/40 ${className}`}
        style={{
          width: 64 * scale,
          height: 64 * scale,
        }}
      >
        <span className="font-pixel text-[6px] text-neon-pink/70 text-center px-1 break-all">
          {path.split('/').pop()}
        </span>
      </div>
    )
  }

  return (
    <img
      src={path}
      alt={alt ?? `${kind} ${name}`}
      onError={() => setErrored(true)}
      style={{
        imageRendering: 'pixelated',
        width: `${scale * 32}px`,
        height: 'auto',
        maxWidth: 'none',
      }}
      className={className}
    />
  )
}
