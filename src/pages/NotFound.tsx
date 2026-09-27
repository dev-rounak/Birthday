import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBuddy } from '../context/BuddyContext'
import { sfx } from '../utils/sfx'

export default function NotFound() {
  const navigate = useNavigate()
  const { say } = useBuddy()

  useEffect(() => {
    sfx.click()
    say('suprised', 'Whoa! This page does not exist!', 'surprised')
    const timer = setTimeout(() => {
      say('sad', 'Let me take you back somewhere safe...', 'sad')
    }, 2000)
    return () => clearTimeout(timer)
  }, [say])

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mt-12">
      <div className="text-6xl opacity-60">{'\u26A0'}</div>
      <h1 className="font-pixel text-2xl sm:text-3xl text-neon-pink uppercase">
        404
      </h1>
      <div className="font-pixel text-[8px] text-neon-sky/60 uppercase tracking-widest text-center">
        Signal Lost
      </div>
      <p className="font-body text-sm text-soft/50 text-center">
        This sector of the mission is not mapped.
      </p>
      <button
        onClick={() => { sfx.click(); navigate('/hub') }}
        className="font-pixel text-[10px] uppercase tracking-wider text-neon-sky border-2 border-neon-blue px-5 py-2.5 transition-all hover:bg-neon-blue/10 hover:shadow-[0_0_16px_rgba(37,99,235,0.5)] active:scale-95"
        style={{ borderRadius: '2px' }}
      >
        {'\u2190 Return to Hub'}
      </button>
    </div>
  )
}
