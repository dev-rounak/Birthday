import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { person } from '../config.js'
import { useBuddy } from '../context/BuddyContext'
import { useXP } from '../context/XPContext'
import { sfx } from '../utils/sfx'
import Sprite from '../components/Sprite'
import Fireworks from '../components/Fireworks'
import Confetti from '../components/Confetti'

export default function Awards() {
    const { say } = useBuddy()
    const { completeLevel, isLevelCompleted } = useXP()

    // Track if trophy has been claimed
    const [awarded, setAwarded] = useState<boolean>(() => {
        return localStorage.getItem('bm_trophy_awarded') === 'true'
    })

    // Dialogue greeting
    useEffect(() => {
        if (awarded) {
            say('celebrating', 'The Grand Birthday Trophy has already been conferred!', 'smile')
        } else {
            say('happy', 'Welcome to the Hall of Honors! Tap the button to present her trophy!', 'wink')
        }
    }, [say, awarded])

    // Award button handler
    const handleAwardTrophy = () => {
        sfx?.unlock?.()
        setTimeout(() => sfx?.success?.(), 300)
        setAwarded(true)
        localStorage.setItem('bm_trophy_awarded', 'true')

        if (!isLevelCompleted('awards')) {
            completeLevel('awards', 50)
        }

        say('celebrating', `Official Birthday Legend Trophy awarded to ${person?.name || 'her'}!`, 'smile')
    }

    return (
        <div className="relative w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center select-none pb-28">
            {/* Fullscreen Celebration effects when trophy is presented */}
            {awarded && (
                <>
                    <Fireworks active={awarded} />
                    <Confetti active={true} />
                </>
            )}

            {/* Sector Header */}
            <div className="text-center space-y-2 mb-6 z-10">
                <div className="font-pixel text-[8px] sm:text-[9px] text-neon-pink uppercase tracking-widest">
                    {'◀'} SECTOR: HALL OF HONORS {'▶'}
                </div>
                <h1 className="font-pixel text-xl sm:text-2xl text-soft uppercase tracking-wider">
                    Birthday Accolades
                </h1>
                <p className="font-body text-xs sm:text-sm text-soft/60">
                    Official Recognition of Awesomeness
                </p>
            </div>

            {/* Main Pedestal Container */}
            <div
                className="w-full bg-navy-900/90 backdrop-blur-md border-2 border-neon-sky/60 p-6 sm:p-8 flex flex-col items-center text-center relative z-10 shadow-[0_0_28px_rgba(56,189,248,0.25)]"
                style={{ borderRadius: '2px' }}
            >
                {/* Neon Corner Brackets */}
                <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-pink pointer-events-none" />
                <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neon-pink pointer-events-none" />
                <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neon-pink pointer-events-none" />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-pink pointer-events-none" />

                {/* Companion Buddy */}
                <div className="mb-4">
                    <Sprite
                        name={awarded ? 'celebrating' : 'stand'}
                        kind="poses"
                        scale={2.6}
                    />
                </div>

                {/* Trophy / Pedestal Visual */}
                <div className="relative my-4 flex flex-col items-center">
                    <div
                        className={`text-6xl sm:text-7xl transition-all duration-700 transform ${awarded
                                ? 'scale-125 filter drop-shadow-[0_0_20px_#fbbf24] animate-bounce'
                                : 'opacity-40 grayscale scale-95'
                            }`}
                    >
                        🏆
                    </div>

                    {/* Pedestal Base */}
                    <div
                        className="w-36 sm:w-44 h-5 mt-2 bg-navy-950 border-2 border-neon-sky/60 flex items-center justify-center shadow-lg"
                        style={{ borderRadius: '2px' }}
                    >
                        <span className="font-pixel text-[7px] text-neon-sky uppercase tracking-widest">
                            {awarded ? 'CONFERRED' : 'LOCKED'}
                        </span>
                    </div>
                </div>

                {/* Honor Title */}
                <div className="space-y-1.5 mt-2 mb-6">
                    <h2 className="font-pixel text-xs sm:text-sm text-neon-pink uppercase tracking-wider">
                        {awarded
                            ? `★ LIFETIME LEGEND TROPHY: ${person?.name?.toUpperCase() || 'HER'} ★`
                            : 'LEGEND TROPHY PENDING'}
                    </h2>
                    <p className="font-body text-xs text-soft/70 max-w-md mx-auto">
                        {awarded
                            ? 'Formally recognized for being the most loving, wonderful, and extraordinary person in the entire cosmos.'
                            : 'Tap the button below to confer the official Birthday Achievement Trophy.'}
                    </p>
                </div>

                {/* Award Button */}
                {!awarded ? (
                    <button
                        onClick={handleAwardTrophy}
                        className="font-pixel text-[10px] uppercase px-6 py-3.5 border-2 border-neon-pink text-neon-pink bg-navy-950 hover:bg-neon-pink/20 transition-all shadow-[0_0_16px_rgba(244,114,182,0.4)] active:scale-95"
                        style={{ borderRadius: '2px' }}
                    >
                        🏆 Award Trophy To Her 🏆
                    </button>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div
                            className="px-4 py-2 border border-green-400/60 bg-green-500/10 text-green-300 font-pixel text-[8px] uppercase tracking-wider shadow-[0_0_12px_rgba(74,222,128,0.25)]"
                            style={{ borderRadius: '2px' }}
                        >
                            ✓ Grand Trophy Bestowed (+50 XP)
                        </div>
                    </div>
                )}
            </div>

            {/* Return to Hub Navigation */}
            <div className="mt-8 z-10">
                <Link
                    to="/hub"
                    className="font-pixel text-[8px] sm:text-[9px] uppercase px-5 py-2.5 border-2 border-neon-sky text-neon-sky bg-navy-900/90 hover:bg-neon-sky/20 transition-all shadow-[0_0_12px_rgba(56,189,248,0.3)] active:scale-95"
                    style={{ borderRadius: '2px' }}
                >
                    {'◀'} Return to Mission Control
                </Link>
            </div>
        </div>
    )
}