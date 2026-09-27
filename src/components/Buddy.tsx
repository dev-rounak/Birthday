import { useState, useEffect } from 'react'
import Sprite from './Sprite'
import { useBuddy } from '../context/BuddyContext'
import { sfx } from '../utils/sfx'

export default function Buddy() {
  const { currentLine, say } = useBuddy()
  const [tapCount, setTapCount] = useState(0)

  // Floating secret unlock easter egg on 7 taps
  const handleBuddyTap = () => {
    sfx?.click?.()
    const nextCount = tapCount + 1
    setTapCount(nextCount)

    if (nextCount === 7) {
      say('celebrating', 'Secret unlocked! Check the secret chamber!', 'wink')
    } else {
      const poses = ['stand', 'wave', 'happy']
      const randomPose = poses[Math.floor(Math.random() * poses.length)]
      say(randomPose, 'Hey there! Ready for your mission?', 'smile')
    }
  }

  // Reset tap counter after inactivity
  useEffect(() => {
    if (tapCount > 0) {
      const timer = setTimeout(() => setTapCount(0), 4000)
      return () => clearTimeout(timer)
    }
  }, [tapCount])

  const pose = currentLine?.pose || 'stand'

  return (
    <div
      onClick={handleBuddyTap}
      className="fixed bottom-4 left-4 z-40 flex flex-col items-center cursor-pointer select-none group"
      style={{
        perspective: '600px',
      }}
    >
      {/* 3D Holographic Bobbing Container */}
      <div
        className="relative flex flex-col items-center transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-2"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(8deg) rotateY(-10deg)',
          animation: 'buddy-float 3s ease-in-out infinite alternate',
        }}
      >
        {/* Sprite with White Background Removal & 3D Lighting */}
        <div
          className="relative overflow-hidden"
          style={{
            // Drops the pure white border box background
            mixBlendMode: 'screen',
            filter: 'contrast(125%) drop-shadow(0 10px 15px rgba(56, 189, 248, 0.4)) drop-shadow(0 2px 4px rgba(244, 114, 182, 0.3))',
          }}
        >
          {/* Scaled down to be sleek and compact */}
          <Sprite
            name={pose}
            kind="poses"
            scale={2.2} // Reduced scale for a sleek companion size
            className="transition-transform duration-200"
          />
        </div>

        {/* 3D Hologram Glow Pedestal */}
        <div
          className="w-12 h-3.5 mt-[-4px] rounded-full border border-neon-sky/40 bg-gradient-to-r from-neon-blue/20 via-neon-sky/40 to-neon-pink/30 blur-[1px] shadow-[0_0_12px_rgba(56,189,248,0.5)]"
          style={{
            transform: 'rotateX(65deg)',
          }}
        />
      </div>

      {/* Retro HUD Tap Badge */}
      <div className="mt-1 px-1.5 py-0.5 bg-navy-950/80 border border-neon-sky/40 shadow-[0_0_8px_rgba(56,189,248,0.3)] rounded-[2px] transition-opacity group-hover:border-neon-pink">
        <span className="font-pixel text-[6px] text-neon-sky group-hover:text-neon-pink tracking-widest uppercase">
          TAP ME
        </span>
      </div>

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes buddy-float {
          0% {
            transform: rotateX(8deg) rotateY(-10deg) translateY(0px);
          }
          100% {
            transform: rotateX(10deg) rotateY(-6deg) translateY(-8px);
          }
        }
      `}</style>
    </div>
  )
}