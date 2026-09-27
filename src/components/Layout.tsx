import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Buddy from './Buddy'
import DialogueBox from './DialogueBox'
import HeartsXP from './HeartsXP'
import MusicPlayer from './MusicPlayer'

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: '⌂' },
  { path: '/hub', label: 'Hub', icon: '◈' },
  { path: '/cake', label: 'Cake', icon: '◉' },
  { path: '/memories', label: 'Memories', icon: '❖' },
  { path: '/gallery', label: 'Gallery', icon: '▣' },
  { path: '/videos', label: 'Videos', icon: '▶' },
  { path: '/reasons', label: 'Reasons', icon: '★' },
  { path: '/quiz', label: 'Quiz', icon: '?' },
  { path: '/game', label: 'Game', icon: '◆' },
  { path: '/wishes', label: 'Wishes', icon: '✦' },
  { path: '/letter', label: 'Letter', icon: '✉' },
  { path: '/secret', label: 'Secret', icon: '⚷' },
  { path: '/achievements', label: 'Awards', icon: '♛' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [transitionKey, setTransitionKey] = useState(0)

  useEffect(() => {
    setTransitionKey((k) => k + 1)
  }, [location.pathname])

  return (
    <div className="blueprint-grid crt-scanlines crt-flicker min-h-screen flex flex-col">
      {/* Top nav - desktop only */}
      <nav className="hidden md:flex sticky top-0 z-50 bg-navy-900/80 backdrop-blur-md border-b border-neon-blue/20 px-6 py-3 items-center justify-center flex-wrap gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `font-pixel text-[8px] uppercase tracking-wider px-3 py-2 transition-all duration-200 border ${
                isActive
                  ? 'border-neon-sky text-neon-sky bg-neon-blue/10 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                  : 'border-transparent text-soft/50 hover:text-neon-sky hover:border-neon-blue/30'
              }`
            }
            style={{ borderRadius: '2px' }}
          >
            <span className="mr-1">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <div className="ml-4">
          <HeartsXP />
        </div>
      </nav>

      {/* Mobile XP bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-navy-900/80 backdrop-blur-md border-b border-neon-blue/20 px-3 py-1.5 flex items-center justify-end">
        <HeartsXP />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-6 pb-24 md:pb-6 max-w-5xl w-full mx-auto mt-8 md:mt-0">
        <div key={transitionKey} className="page-glitch w-full flex flex-col items-center">
          {children}
        </div>
      </main>

      {/* Bottom nav - mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy-900/90 backdrop-blur-md border-t border-neon-blue/20">
        <div className="flex overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 transition-all duration-200 ${
                  isActive ? 'text-neon-sky' : 'text-soft/40'
                }`
              }
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span className="font-pixel text-[6px] uppercase tracking-wider">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mini music player */}
      <MusicPlayer />

      {/* Floating buddy companion */}
      <Buddy />

      {/* RPG dialogue box */}
      <DialogueBox />
    </div>
  )
}
