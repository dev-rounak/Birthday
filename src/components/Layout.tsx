import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useXP } from '../context/XPContext'
import Buddy from './Buddy'
import DialogueBox from './DialogueBox'
import HeartsXP from './HeartsXP'
import MusicPlayer from './MusicPlayer'
import ParticlesBackground from './ParticlesBackground' // <-- 1. Import here

interface NavItemConfig {
  path: string
  id: string
  label: string
  icon: string
}

const NAV_ITEMS: NavItemConfig[] = [
  { path: '/', id: 'gate', label: 'Home', icon: '⌂' },
  { path: '/hub', id: 'hub', label: 'Hub', icon: '◈' },
  { path: '/cake', id: 'cake', label: 'Cake', icon: '◉' },
  { path: '/gallery', id: 'gallery', label: 'Gallery', icon: '▣' },
  { path: '/reasons', id: 'reasons', label: 'Reasons', icon: '★' },
  { path: '/arcade', id: 'arcade', label: 'Arcade', icon: '◆' },
  { path: '/letter', id: 'letter', label: 'Letter', icon: '✉' },
  { path: '/awards', id: 'awards', label: 'Awards', icon: '♛' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { isUnlocked, isLevelCompleted } = useXP()
  const [transitionKey, setTransitionKey] = useState(0)

  const isHomePage = location.pathname === '/'

  useEffect(() => {
    setTransitionKey((k) => k + 1)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div
      className={`blueprint-grid crt-scanlines crt-flicker flex flex-col relative select-none ${isHomePage ? 'h-screen overflow-hidden' : 'min-h-screen overflow-y-auto'
        }`}
    >
      {/* Background Particles across entire app */}
      <ParticlesBackground />

      {/* Top Navbar */}
      <header className="hidden md:flex sticky top-0 z-50 bg-navy-900/90 backdrop-blur-md border-b border-neon-blue/20 px-6 py-2.5 items-center justify-between flex-shrink-0">
        <nav className="flex items-center gap-1.5 flex-wrap">
          {NAV_ITEMS.map((item) => {
            const unlocked = isUnlocked(item.id)
            const completed = isLevelCompleted(item.id)

            if (!unlocked) {
              return (
                <span
                  key={item.path}
                  className="font-pixel text-[8px] uppercase tracking-wider px-3 py-1.5 border border-transparent text-soft/20 cursor-not-allowed select-none flex items-center"
                  title="Complete previous sector to unlock"
                >
                  <span className="mr-1 opacity-60">🔒</span>
                  {item.label}
                </span>
              )
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `font-pixel text-[8px] uppercase tracking-wider px-3 py-1.5 transition-all duration-200 border ${isActive
                    ? 'border-neon-sky text-neon-sky bg-neon-blue/10 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                    : 'border-transparent text-soft/50 hover:text-neon-sky hover:border-neon-blue/30'
                  }`
                }
                style={{ borderRadius: '2px' }}
              >
                <span className="mr-1">{completed ? '✓' : item.icon}</span>
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div>
          <HeartsXP />
        </div>
      </header>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-navy-900/90 backdrop-blur-md border-b border-neon-blue/20 px-3 py-1.5 flex items-center justify-end">
        <HeartsXP />
      </div>

      {/* Main Viewport Content Stage */}
      <main
        className={`flex-1 w-full flex flex-col items-center p-3 sm:p-6 mt-7 md:mt-0 relative z-10 ${isHomePage
            ? 'h-[calc(100vh-3.5rem)] justify-center overflow-hidden'
            : 'min-h-[calc(100vh-4rem)] justify-start pb-28 md:pb-16'
          }`}
      >
        <div key={transitionKey} className="page-glitch w-full flex flex-col items-center">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy-900/95 backdrop-blur-md border-t border-neon-blue/20 flex-shrink-0">
        <div className="flex overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const unlocked = isUnlocked(item.id)
            const completed = isLevelCompleted(item.id)

            if (!unlocked) {
              return (
                <div
                  key={item.path}
                  className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 opacity-25 cursor-not-allowed select-none"
                >
                  <span className="text-sm leading-none">🔒</span>
                  <span className="font-pixel text-[6px] uppercase tracking-wider">{item.label}</span>
                </div>
              )
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 transition-all duration-200 ${isActive ? 'text-neon-sky' : 'text-soft/40'
                  }`
                }
              >
                <span className="text-sm leading-none">{completed ? '✓' : item.icon}</span>
                <span className="font-pixel text-[6px] uppercase tracking-wider">{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* Floating HUD controls */}
      <MusicPlayer />
      <Buddy />
      <DialogueBox />
    </div>
  )
}