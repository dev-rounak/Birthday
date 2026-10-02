import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useBuddy } from '../context/BuddyContext'
import { useXP } from '../context/XPContext'
import { sfx } from '../utils/sfx'

// =========================================================================
// 📝 EDIT YOUR REASONS / ENVELOPE MESSAGES HERE
// =========================================================================
export interface ReasonItem {
    id: number
    title: string
    message: string
    tag?: string
}

const REASONS_LIST: ReasonItem[] = [
    {
        id: 1,
        title: 'THAT SMILE ☺️',
        message:
            'Your smile has this unfair ability to make everything around you feel a little lighter. No matter how bad the day is, seeing you smile somehow makes it better. I dont think you even realize how beautiful your smile is… or how often it makes me smile too',
        tag: 'JOY',
    },
    {
        id: 2,
        title: 'THOSE EYES 👀 ',
        message:
            'There’s something about your eyes that I could never properly explain. They can be cute, mischievous, emotional, and somehow tell me things even when you dont say anything. I could probably get lost in them a thousand times and still not get bored',
        tag: 'HEART',
    },
    {
        id: 3,
        title: 'Unstoppable Determination 🔥',
        message:
            'I admire how you keep going even when things arent easy. You might doubt yourself sometimes, but I see how hard you try, how much you care, and how you keep pushing forward. That strength in you is something I will always admire',
        tag: 'STRENGTH',
    },
    {
        id: 4,
        title: 'Late Night Talks ✨',
        message:
            'The random late-night rambles about life, our dreams, and silly thoughts that only we understand. Time always disappears when I talk to you.',
        tag: 'MEMORIES',
    },
    {
        id: 5,
        title: 'Being My Safe Space 🔐',
        message:
            'You became a place where I feel understood, comfortable, and loved. And honestly, in a world that can sometimes feel overwhelming, having you feels like coming home. ',
        tag: 'COMFORT',
    },
    {
        id: 6,
        title: 'Just Being You 💖',
        message:
            'It is not just one thing that makes you amazing. It is your weird little habits, your laugh, your mood swings, your random thoughts, the way you talk, the way you get excited about things… all those tiny pieces somehow come together to make my favorite person.',
        tag: 'SPECIAL',
    },
]

export default function Reasons() {
    const navigate = useNavigate()
    const { say } = useBuddy()
    const { completeLevel, isLevelCompleted } = useXP()

    const [openedIds, setOpenedIds] = useState<number[]>([])
    const [selectedReason, setSelectedReason] = useState<ReasonItem | null>(null)

    useEffect(() => {
        say('happy', 'Every envelope holds a reason why you are truly special. Tap to unseal them!', 'smile')
    }, [say])

    const handleOpenEnvelope = (reason: ReasonItem) => {
        sfx?.click?.()
        setSelectedReason(reason)

        if (!openedIds.includes(reason.id)) {
            const nextOpened = [...openedIds, reason.id]
            setOpenedIds(nextOpened)

            // When all are opened, complete sector
            if (nextOpened.length >= REASONS_LIST.length && !isLevelCompleted('reasons')) {
                sfx?.success?.()
                completeLevel('reasons', 50)
                say('celebrating', 'All letters unsealed! Arcade sector is now unlocked!', 'smile')
            }
        }
    }

    const handleCloseModal = () => {
        sfx?.pop?.()
        setSelectedReason(null)
    }

    const progressPercent = Math.round((openedIds.length / REASONS_LIST.length) * 100)
    const isAllOpened = openedIds.length >= REASONS_LIST.length

    return (
        <div className="relative w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center select-none pb-24">
            {/* Header */}
            <div className="text-center space-y-2 mb-6">
                <div className="font-pixel text-[8px] sm:text-[9px] text-neon-pink uppercase tracking-widest">
                    {'◀'} SECTOR 04: REASONS {'▶'}
                </div>
                <h1 className="font-pixel text-xl sm:text-2xl text-soft uppercase tracking-wider">
                    Reasons You're Awesome & Special
                </h1>
                <p className="font-body text-xs sm:text-sm text-soft/60">
                    Unseal each envelope to reveal personal messages
                </p>

                {/* Progress Bar */}
                <div className="flex items-center justify-center gap-3 pt-2">
                    <div className="w-48 bg-navy-950 border border-neon-sky/40 h-2 p-0.5 rounded-[1px]">
                        <div
                            className="bg-neon-sky h-full transition-all duration-500 shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="font-pixel text-[8px] text-neon-sky">
                        {openedIds.length} / {REASONS_LIST.length} UNSEALED
                    </span>
                </div>
            </div>

            {/* Grid of Envelopes (No Preview - Clean Title & Status Only) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {REASONS_LIST.map((item) => {
                    const isOpen = openedIds.includes(item.id)

                    return (
                        <div
                            key={item.id}
                            onClick={() => handleOpenEnvelope(item)}
                            className={`group relative cursor-pointer p-5 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between min-h-[175px] ${isOpen
                                ? 'bg-navy-900/90 border-2 border-neon-sky/60 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                                : 'bg-navy-900/60 border-2 border-neon-pink/40 hover:border-neon-pink shadow-[0_0_10px_rgba(244,114,182,0.15)] hover:shadow-[0_0_16px_rgba(244,114,182,0.35)]'
                                }`}
                            style={{ borderRadius: '2px' }}
                        >
                            {/* Header Badges */}
                            <div className="flex items-center justify-between">
                                <span className="font-pixel text-[7px] text-neon-pink/80 uppercase">
                                    #{item.id < 10 ? `0${item.id}` : item.id}
                                </span>
                                {item.tag && (
                                    <span className="font-pixel text-[6px] px-1.5 py-0.5 border border-neon-sky/30 bg-neon-sky/10 text-neon-sky uppercase">
                                        {item.tag}
                                    </span>
                                )}
                            </div>

                            {/* Envelope Pixel Art Graphic */}
                            <div className="flex justify-center my-3">
                                <div
                                    className={`w-16 h-11 relative border-2 flex items-center justify-center transition-all ${isOpen
                                        ? 'border-neon-sky bg-navy-800'
                                        : 'border-neon-pink bg-navy-950 group-hover:scale-105'
                                        }`}
                                    style={{ borderRadius: '2px' }}
                                >
                                    <div
                                        className={`absolute top-0 inset-x-0 h-4 border-b transition-colors ${isOpen ? 'border-neon-sky/50 bg-neon-sky/10' : 'border-neon-pink/50 bg-neon-pink/10'
                                            }`}
                                        style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                                    />
                                    <span className="text-xs z-10">{isOpen ? '💌' : '✉️'}</span>
                                </div>
                            </div>

                            {/* Clean Title Only */}
                            <div className="text-center">
                                <h3 className="font-pixel text-[9px] sm:text-[10px] text-soft group-hover:text-neon-sky uppercase transition-colors tracking-wide">
                                    {item.title}
                                </h3>
                            </div>

                            {/* Tap Status */}
                            <div className="mt-3 text-center">
                                <span
                                    className={`font-pixel text-[7px] uppercase tracking-wider ${isOpen ? 'text-neon-sky/80' : 'text-neon-pink animate-pulse'
                                        }`}
                                >
                                    {isOpen ? '✓ READ' : '▶ TAP TO UNSEAL'}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Sequential Links */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
                <Link
                    to="/gallery"
                    className="font-pixel text-[8px] sm:text-[9px] uppercase px-4 py-2.5 border border-neon-blue/40 text-soft/70 bg-navy-900/90 hover:bg-neon-sky/10 transition-all"
                    style={{ borderRadius: '2px' }}
                >
                    {'◀'} Hall of Fame
                </Link>

                <button
                    onClick={() => {
                        if (!isLevelCompleted('reasons')) {
                            completeLevel('reasons', 50)
                        }
                        sfx?.success?.()
                        navigate('/arcade')
                    }}
                    className={`font-pixel text-[9px] sm:text-[10px] uppercase px-6 py-2.5 border-2 border-neon-sky text-neon-sky bg-navy-900 hover:bg-neon-sky/20 transition-all shadow-[0_0_16px_rgba(56,189,248,0.4)] active:scale-95 flex items-center gap-2 ${!isAllOpened ? 'opacity-85' : 'animate-pulse'
                        }`}
                    style={{ borderRadius: '2px' }}
                >
                    <span>Next Sector: Arcade Game</span>
                    <span>▶</span>
                </button>
            </div>

            {/* Reading Modal */}
            {selectedReason && (
                <div
                    onClick={handleCloseModal}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg bg-navy-900 border-2 border-neon-sky p-6 sm:p-8 shadow-[0_0_30px_rgba(56,189,248,0.3)]"
                        style={{ borderRadius: '2px' }}
                    >
                        <div className="flex items-center justify-between border-b border-neon-sky/30 pb-3 mb-4">
                            <div>
                                <span className="font-pixel text-[7px] text-neon-pink uppercase tracking-widest">
                                    LETTER #{selectedReason.id < 10 ? `0${selectedReason.id}` : selectedReason.id}
                                </span>
                                <h2 className="font-pixel text-xs sm:text-sm text-neon-sky uppercase mt-1">
                                    {selectedReason.title}
                                </h2>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="font-pixel text-[9px] px-2.5 py-1 border border-neon-pink text-neon-pink bg-navy-950 hover:bg-neon-pink/20 transition-all"
                                style={{ borderRadius: '2px' }}
                            >
                                [X]
                            </button>
                        </div>

                        <div className="py-2 min-h-[120px] flex items-center">
                            <p className="font-body text-sm sm:text-base text-soft leading-relaxed">
                                "{selectedReason.message}"
                            </p>
                        </div>

                        <div className="mt-6 pt-3 border-t border-neon-sky/20 flex items-center justify-between">
                            <span className="font-pixel text-[7px] text-neon-sky/60 uppercase">
                                {selectedReason.tag ? `[ ${selectedReason.tag} ]` : '[ SPECIAL ]'}
                            </span>
                            <button
                                onClick={handleCloseModal}
                                className="font-pixel text-[8px] uppercase px-4 py-2 border border-neon-sky text-neon-sky hover:bg-neon-sky/10 transition-all active:scale-95"
                                style={{ borderRadius: '2px' }}
                            >
                                Done Reading
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}