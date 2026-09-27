import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { sfx } from '../utils/sfx'

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'blue' | 'pink'
  size?: 'sm' | 'md' | 'lg'
}

export default function PixelButton({
  children,
  variant = 'blue',
  size = 'md',
  className = '',
  ...props
}: PixelButtonProps) {
  const colors = {
    blue: 'border-neon-blue text-neon-sky hover:bg-neon-blue/10 hover:shadow-[0_0_16px_rgba(37,99,235,0.5)]',
    pink: 'border-neon-pink text-neon-pink hover:bg-neon-pink/10 hover:shadow-[0_0_16px_rgba(244,114,182,0.5)]',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-[8px]',
    md: 'px-5 py-2.5 text-[10px]',
    lg: 'px-8 py-3.5 text-xs',
  }

  return (
    <button
      className={`font-pixel uppercase tracking-wider border-2 bg-transparent transition-all duration-200 active:scale-95 ${colors[variant]} ${sizes[size]} ${className}`}
      style={{ borderRadius: '2px' }}
      onClick={(e) => {
        sfx.click()
        props.onClick?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
}
