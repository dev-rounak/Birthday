import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export interface LevelConfig {
  id: string
  name: string
  xpRequired: number
  icon?: string
  description?: string
}

export const LEVELS: LevelConfig[] = [
  { id: 'gate', name: 'Access Terminal', xpRequired: 50, icon: 'terminal' },
  { id: 'cake', name: 'Birthday Cake', xpRequired: 100, icon: 'cake' },
  { id: 'gallery', name: 'Hall of Fame', xpRequired: 150, icon: 'photo' },
  { id: 'reasons', name: 'Reasons Why', xpRequired: 200, icon: 'heart' },
  { id: 'arcade', name: 'Arcade Arena', xpRequired: 250, icon: 'game' },
  { id: 'wishes', name: 'Wishes Wall', xpRequired: 350, icon: 'star' },
  { id: 'letter', name: 'Love Letter', xpRequired: 400, icon: 'mail' },
  { id: 'secret', name: 'Secret Chamber', xpRequired: 500, icon: 'key' },
]

interface XPContextValue {
  xp: number
  level: number
  completedLevels: string[]
  addXP: (amount: number) => void
  completeLevel: (levelId: string, xpReward?: number) => void
  isLevelCompleted: (levelId: string) => boolean
  isUnlocked: (levelId: string) => boolean
}

const XPContext = createContext<XPContextValue | null>(null)

export function XPProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('bm_xp')
    return saved ? parseInt(saved, 10) : 0
  })

  const [completedLevels, setCompletedLevels] = useState<string[]>(() => {
    const saved = localStorage.getItem('bm_completed_levels')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('bm_xp', xp.toString())
  }, [xp])

  useEffect(() => {
    localStorage.setItem('bm_completed_levels', JSON.stringify(completedLevels))
  }, [completedLevels])

  const level = Math.floor(xp / 100) + 1

  const addXP = useCallback((amount: number) => {
    setXp((prev) => prev + amount)
  }, [])

  const completeLevel = useCallback((levelId: string, xpReward = 50) => {
    setCompletedLevels((prev) => {
      if (prev.includes(levelId)) return prev
      return [...prev, levelId]
    })
    setXp((prev) => prev + xpReward)
  }, [])

  const isLevelCompleted = useCallback(
    (levelId: string) => completedLevels.includes(levelId),
    [completedLevels]
  )

  // Returns true if the level is completed OR the user has enough XP for it
  const isUnlocked = useCallback(
    (levelId: string) => {
      if (levelId === 'gate') return true
      if (completedLevels.includes(levelId)) return true
      const target = LEVELS.find((l) => l.id === levelId)
      if (!target) return true
      return xp >= target.xpRequired
    },
    [completedLevels, xp]
  )

  return (
    <XPContext.Provider
      value={{
        xp,
        level,
        completedLevels,
        addXP,
        completeLevel,
        isLevelCompleted,
        isUnlocked,
      }}
    >
      {children}
    </XPContext.Provider>
  )
}

export function useXP() {
  const ctx = useContext(XPContext)
  if (!ctx) throw new Error('useXP must be used within XPProvider')
  return ctx
}