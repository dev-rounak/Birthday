import HudCard from '../components/HudCard'
import PixelButton from '../components/PixelButton'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mt-4">
      <div className="text-center">
        <div className="font-pixel text-[8px] text-neon-pink uppercase tracking-widest mb-4">
          ◆ Mission Initiated ◆
        </div>
        <h1 className="font-pixel text-lg sm:text-2xl text-soft uppercase leading-tight mb-2">
          Birthday
        </h1>
        <h1 className="font-pixel text-lg sm:text-2xl text-neon-sky uppercase leading-tight">
          Mission
        </h1>
        <div className="font-pixel text-[8px] text-neon-sky/50 mt-3 flex items-center justify-center gap-1">
          PRESS START
          <span className="cursor-blink">▌</span>
        </div>
      </div>

      <HudCard icon="◈" label="Main Hub" number="01" glow="pink" className="w-full">
        <p className="font-body text-sm text-soft/60 text-center leading-relaxed mb-4">
          A retro pixel adventure built just for you. Explore cake, memories, games, and more.
        </p>
        <div className="flex justify-center">
          <PixelButton variant="pink" size="md" onClick={() => navigate('/hub')}>
            Enter Hub →
          </PixelButton>
        </div>
      </HudCard>
    </div>
  )
}
