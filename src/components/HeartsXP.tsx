import Sprite from './Sprite'
import { useXP, LEVELS } from '../context/XPContext'

export default function HeartsXP() {
  const { xp, level } = useXP()

  const nextLevel = LEVELS[level + 1]
  const currentLevelXp = LEVELS[level]?.xp ?? 0
  const progress = nextLevel
    ? Math.min(1, (xp - currentLevelXp) / (nextLevel.xp - currentLevelXp))
    : 1

  const hearts = 5
  const filledHearts = Math.ceil(progress * hearts)

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: hearts }).map((_, i) => (
          <div
            key={i}
            className={i < filledHearts ? 'opacity-100' : 'opacity-25'}
            style={{ filter: i < filledHearts ? 'drop-shadow(0 0 3px rgba(244, 114, 182, 0.6))' : 'none' }}
          >
            <Sprite name="heart" kind="props" scale={1} />
          </div>
        ))}
      </div>
      <div className="font-pixel text-[7px] text-neon-pink/80 uppercase">
        LV {level + 1}
      </div>
      <div className="font-pixel text-[7px] text-soft/50">
        {xp} XP
      </div>
    </div>
  )
}
