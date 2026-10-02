import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export interface LevelConfig {
  id: string
  name: string
  icon?: string
}

// 1. Exact sequential order from start to finish
export const LEVEL_ORDER = [
  'gate',    // 0: Password Terminal (Home)
  'hub',     // 1: Mission Control Hub
  'cake',    // 2: Blow out candles & cut cake
  'gallery', // 3: Memory Vault
  'reasons', // 4: Reasons envelopes
  'arcade',  // 5: Arcade mini game
  'letter',  // 6: Heartfelt letter
  'awards',  // 7: Final certificate & awards
]

export const LEVELS = LEVEL_ORDER.map((id) => ({ id, name: id.toUpperCase() }))

interface XPContextValue {
  xp: number
  level: number
  completedLevels: string[]
  addXP: (amount: number) => void
  completeLevel: (levelId: string, xpReward?: number) => void
  isLevelCompleted: (levelId: string) => boolean
  isUnlocked: (levelId: string) => boolean
  resetProgress: () => void
}

const XPContext = createContext<XPContextValue | null>(null)

export function XPProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('bm_xp')
    return saved ? parseInt(saved, 10) : 0
  })

  const [completedLevels, setCompletedLevels] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bm_completed_levels')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Sync to localStorage
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

  // Check if a level is marked completed
  const isLevelCompleted = useCallback(
    (levelId: string) => completedLevels.includes(levelId),
    [completedLevels]
  )

  // STRICT SEQUENTIAL CHECK:
  // A level is ONLY unlocked if EVERY preceding level in LEVEL_ORDER has been completed.
  const isUnlocked = useCallback(
    (levelId: string) => {
      if (levelId === 'gate' || levelId === 'home') return true

      const targetIndex = LEVEL_ORDER.indexOf(levelId)
      if (targetIndex <= 0) return true

      // Verify that every single prior level before this one is completed
      for (let i = 0; i < targetIndex; i++) {
        const priorId = LEVEL_ORDER[i]
        if (!completedLevels.includes(priorId)) {
          return false
        }
      }

      return true
    },
    [completedLevels]
  )

  // Reset function to clear all progress and start fresh from Home
  const resetProgress = useCallback(() => {
    localStorage.removeItem('bm_xp')
    localStorage.removeItem('bm_completed_levels')
    setXp(0)
    setCompletedLevels([])
  }, [])

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
        resetProgress,
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