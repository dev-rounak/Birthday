import { useXP, LEVELS } from '../context/XPContext'

export default function HeartsXP() {
  const { xp, level } = useXP()

  const currentLevelObj = (LEVELS[level - 1] || LEVELS[0]) as any
  const nextLevelObj = (LEVELS[level] || LEVELS[LEVELS.length - 1]) as any

  const currentLevelXp = currentLevelObj?.xpRequired ?? currentLevelObj?.xp ?? 0
  const nextLevelXp = nextLevelObj?.xpRequired ?? nextLevelObj?.xp ?? 100

  const progress =
    nextLevelXp > currentLevelXp
      ? Math.min(1, Math.max(0, (xp - currentLevelXp) / (nextLevelXp - currentLevelXp)))
      : 1

  const heartsTotal = 5
  const fullHearts = Math.min(heartsTotal, Math.max(1, Math.ceil(progress * heartsTotal)))

  return (
    <div className="flex items-center gap-3 bg-navy-950/80 border border-neon-sky/30 px-3 py-1.5 rounded-[2px] shadow-[0_0_10px_rgba(56,189,248,0.2)]">
      {/* Pixel Hearts Bar */}
      <div className="flex items-center gap-1">
        {Array.from({ length: heartsTotal }).map((_, i) => (
          <span
            key={i}
            className={`font-pixel text-[10px] sm:text-xs transition-all ${i < fullHearts ? 'text-neon-pink animate-pulse' : 'text-soft/20'
              }`}
          >
            ♥
          </span>
        ))}
      </div>

      {/* Level & XP counter */}
      <div className="flex items-center gap-1.5 font-pixel text-[7px] sm:text-[8px] border-l border-neon-sky/30 pl-2">
        <span className="text-neon-sky">LV {level}</span>
        <span className="text-soft/40">•</span>
        <span className="text-neon-pink">{xp} XP</span>
      </div>
    </div>
  )
}