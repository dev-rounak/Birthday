import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface BuddyLine {
  pose: string
  face: string
  text: string
}

interface BuddyContextValue {
  currentLine: BuddyLine | null
  say: (pose: string, text: string, face?: string) => void
  dismiss: () => void
}

const BuddyContext = createContext<BuddyContextValue | null>(null)

export function BuddyProvider({ children }: { children: ReactNode }) {
  const [currentLine, setCurrentLine] = useState<BuddyLine | null>(null)

  const say = useCallback((pose: string, text: string, face = 'smile') => {
    setCurrentLine({ pose, face, text })
  }, [])

  const dismiss = useCallback(() => {
    setCurrentLine(null)
  }, [])

  return (
    <BuddyContext.Provider value={{ currentLine, say, dismiss }}>
      {children}
    </BuddyContext.Provider>
  )
}

export function useBuddy() {
  const ctx = useContext(BuddyContext)
  if (!ctx) throw new Error('useBuddy must be used within BuddyProvider')
  return ctx
}