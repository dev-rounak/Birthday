import HudCard from '../components/HudCard'

interface PlaceholderPageProps {
  title: string
  icon: string
  description?: string
  glow?: 'blue' | 'pink'
}

export default function PlaceholderPage({ title, icon, description, glow = 'blue' }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mt-8">
      <div className="text-5xl mb-2 opacity-80">{icon}</div>
      <h1 className="font-pixel text-sm sm:text-base text-soft text-center uppercase tracking-widest">
        {title}
      </h1>
      <HudCard icon="◆" label="System Status" glow={glow} className="w-full">
        <p className="font-body text-sm text-soft/60 text-center leading-relaxed">
          {description || 'This module is still being calibrated. Check back soon.'}
        </p>
        <div className="mt-4 flex justify-center">
          <div className="font-pixel text-[8px] text-neon-sky/50 flex items-center gap-1">
            LOADING
            <span className="cursor-blink">▌</span>
          </div>
        </div>
      </HudCard>
    </div>
  )
}
