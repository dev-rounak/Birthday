import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useXP } from '../context/XPContext'

interface RouteGuardProps {
    levelId: string
    children: ReactNode
}

export default function RouteGuard({ levelId, children }: RouteGuardProps) {
    const { isUnlocked, isLevelCompleted } = useXP()

    if (!isUnlocked(levelId)) {
        // If gate password was not completed, send to terminal
        if (!isLevelCompleted('gate')) {
            return <Navigate to="/" replace />
        }
        // Otherwise redirect to Hub
        return <Navigate to="/hub" replace />
    }

    return <>{children}</>
}