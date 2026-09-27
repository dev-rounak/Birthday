import type { ReactNode } from 'react'

interface HudCardProps {
  icon?: ReactNode
  label?: string
  number?: string | number
  children?: ReactNode
  glow?: 'blue' | 'pink'
  className?: string
}

export default function HudCard({
  icon,
  label,
  number,
  children,
  glow = 'blue',
  className = '',
}: HudCardProps) {
  const glowColor = glow === 'pink' ? 'neon-pink' : 'neon-blue'
  const glowShadow = glow === 'pink' ? 'shadow-[0_0_12px_rgba(244,114,182,0.3)]' : 'shadow-[0_0_12px_rgba(37,99,235,0.3)]'

  return (
    <div
      className={`relative bg-navy-800/60 backdrop-blur-sm border border-${glowColor}/40 ${glowShadow} rounded-sm p-4 sm:p-6 ${className}`}
    >
      {/* Corner brackets */}
      <span className={`absolute top-0 left-0 w-3 h-3 border-t border-l border-${glowColor} pointer-events-none`} />
      <span className={`absolute top-0 right-0 w-3 h-3 border-t border-r border-${glowColor} pointer-events-none`} />
      <span className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l border-${glowColor} pointer-events-none`} />
      <span className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r border-${glowColor} pointer-events-none`} />

      {(icon || label) && (
        <div className="flex items-center gap-2 mb-3">
          {icon && <span className="text-neon-sky text-sm">{icon}</span>}
          {label && (
            <span className="font-pixel text-[8px] sm:text-[10px] text-neon-sky/80 uppercase tracking-widest">
              {label}
            </span>
          )}
        </div>
      )}

      {number !== undefined && (
        <div className="font-pixel text-2xl sm:text-3xl text-soft mb-2 flex items-baseline">
          {number}
          <span className={`cursor-blink text-${glowColor} ml-0.5`}>▌</span>
        </div>
      )}

      {children}
    </div>
  )
}
