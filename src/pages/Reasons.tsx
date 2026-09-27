import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBuddy } from '../context/BuddyContext'
import { useXP } from '../context/XPContext'
import { sfx } from '../utils/sfx'
// =========================================================================
// 📝 EDIT YOUR REASONS / ENVELOPE MESSAGES HERE
// You can add, edit, or delete as many envelope objects as you like.
// =========================================================================
export interface ReasonItem {
    id: number
    title: string      // Appears on the front of the envelope tag
    preview: string    // Short one-liner
    message: string    // Full letter text revealed when opened
    tag?: string       // Category / badge label (e.g., "SMILE", "HEART")
}

const REASONS_LIST: ReasonItem[] = [
    {
        id: 1,
        title: 'Your Contagious Laugh',
        preview: 'How your laugh lights up any room...',
        message:
            'The way you laugh without holding back is one of my favorite things in the entire world. No matter how heavy a day feels, your smile instantly makes everything lighter.',
        tag: 'JOY',
    },
    {
        id: 2,
        title: 'Your Kindness',
        preview: 'The gentleness you show to everyone...',
        message:
            'You have this natural warmth and pure empathy for people and animals around you. You pay attention to the smallest details that most people overlook, and that makes you truly rare.',
        tag: 'HEART',
    },
    {
        id: 3,
        title: 'Unstoppable Determination',
        preview: 'How fiercely you pursue your passions...',
        message:
            'Whenever you set your heart on something, you give it your absolute everything. Watching you work hard and never give up is deeply inspiring to me every single day.',
        tag: 'STRENGTH',
    },
    {
        id: 4,
        title: 'Late Night Talks',
        preview: 'Our timeless conversations...',
        message:
            'The random late-night rambles about life, our dreams, silly thoughts, and inside jokes that only the two of us understand. Time always disappears when I talk to you.',
        tag: 'MEMORIES',
    },
    {
        id: 5,
        title: 'Being My Safe Space',
        preview: 'Never having to pretend...',
        message:
            'With you, I can completely let my guard down and just be myself without fear of judgment. You make the world feel safe, warm, and understood.',
        tag: 'COMFORT',
    },
    {
        id: 6,
        title: 'Your Radiant Energy',
        preview: 'The spark you bring everywhere...',
        message:
            'You carry a spark that turns ordinary, quiet days into adventures. Life with you around is always brighter, more colorful, and never boring.',
        tag: 'SPARK',
    },
    {
        id: 7,
        title: 'How You Care For Others',
        preview: 'Your selfless, gentle heart...',
        message:
            'You are always thinking about how others feel and checking in to make sure everyone is okay. The world genuinely needs more souls as gentle and giving as yours.',
        tag: 'KINDNESS',
    },
    {
        id: 8,
        title: 'Just Being You',
        preview: 'The most important reason of all...',
        message:
            'Out of billions of people on this planet, there is nobody quite like you. Thank you for existing, for being in my life, and for making my world so much more beautiful every single day. Happy Birthday!',
        tag: 'SPECIAL',
    },
    // ➕ ADD MORE LETTERS HERE:
    // {
    //   id: 9,
    //   title: 'Your Next Title',
    //   preview: 'Short preview note...',
    //   message: 'Your sweet message here...',
    //   tag: 'TAG',
    // },
]
// =========================================================================

export default function Reasons() {
    const { say } = useBuddy()
    const { completeLevel, isLevelCompleted } = useXP()

    // Tracks opened envelopes by their id
    const [openedIds, setOpenedIds] = useState<number[]>([])
    // Selected envelope for reading modal
    const [selectedReason, setSelectedReason] = useState<ReasonItem | null>(null)

    // Dialogue prompt on mount
    useEffect(() => {
        say('happy', 'Every envelope holds a reason why you are truly special. Tap to unseal them!', 'smile')
    }, [say])

    // Tap an envelope
    const handleOpenEnvelope = (reason: ReasonItem) => {
        sfx?.click?.()
        setSelectedReason(reason)

        if (!openedIds.includes(reason.id)) {
            const nextOpened = [...openedIds, reason.id]
            setOpenedIds(nextOpened)

            // Award XP when all envelopes are read
            if (nextOpened.length === REASONS_LIST.length && !isLevelCompleted('reasons')) {
                sfx?.success?.()
                completeLevel('reasons', 50)
                say('celebrating', 'All letters unsealed! You unlocked +50 XP!', 'smile')
            }
        }
    }

    const handleCloseModal = () => {
        sfx?.pop?.()
        setSelectedReason(null)
    }

    const progressPercent = Math.round((openedIds.length / REASONS_LIST.length) * 100)

    return (
        <div className="relative w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center select-none pb-24">
            {/* Top Header */}
            <div className="text-center space-y-2 mb-6">
                <div className="font-pixel text-[8px] sm:text-[9px] text-neon-pink uppercase tracking-widest">
                    {'\u25C0'} SECTOR: REASONS {'\u25B6'}
                </div>
                <h1 className="font-pixel text-xl sm:text-2xl text-soft uppercase tracking-wider">
                    Reasons You're Awesome
                </h1>
                <p className="font-body text-xs sm:text-sm text-soft/60">
                    Unseal each envelope to reveal personal messages
                </p>

                {/* Progress Tracker */}
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

            {/* Grid of Envelopes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {REASONS_LIST.map((item) => {
                    const isOpen = openedIds.includes(item.id)

                    return (
                        <div
                            key={item.id}
                            onClick={() => handleOpenEnvelope(item)}
                            className={`group relative cursor-pointer p-4 transition-all duration-300 transform hover:-translate-y-1 ${isOpen
                                ? 'bg-navy-900/90 border-2 border-neon-sky/60 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                                : 'bg-navy-900/60 border-2 border-neon-pink/40 hover:border-neon-pink shadow-[0_0_10px_rgba(244,114,182,0.15)] hover:shadow-[0_0_16px_rgba(244,114,182,0.35)]'
                                }`}
                            style={{ borderRadius: '2px' }}
                        >
                            {/* Corner Accents */}
                            <span className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-neon-sky/70" />
                            <span className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-neon-sky/70" />
                            <span className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-neon-sky/70" />
                            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-neon-sky/70" />

                            {/* Envelope Body Header */}
                            <div className="flex items-center justify-between mb-3">
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
                            <div className="flex justify-center my-2">
                                <div
                                    className={`w-16 h-11 relative border-2 flex items-center justify-center transition-all ${isOpen
                                        ? 'border-neon-sky bg-navy-800'
                                        : 'border-neon-pink bg-navy-950 group-hover:scale-105'
                                        }`}
                                    style={{ borderRadius: '2px' }}
                                >
                                    {/* Flap fold */}
                                    <div
                                        className={`absolute top-0 inset-x-0 h-4 border-b transition-colors ${isOpen ? 'border-neon-sky/50 bg-neon-sky/10' : 'border-neon-pink/50 bg-neon-pink/10'
                                            }`}
                                        style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                                    />

                                    {/* Stamp / Heart Seal */}
                                    <span className="text-xs z-10">{isOpen ? '💌' : '✉️'}</span>
                                </div>
                            </div>

                            {/* Preview Title */}
                            <div className="text-center mt-3">
                                <h3 className="font-pixel text-[8px] sm:text-[9px] text-soft group-hover:text-neon-sky uppercase transition-colors truncate">
                                    {item.title}
                                </h3>
                                <p className="font-body text-xs text-soft/60 mt-1 line-clamp-2">
                                    {isOpen ? item.message : item.preview}
                                </p>
                            </div>

                            {/* Tap Status */}
                            <div className="mt-3 text-center">
                                <span
                                    className={`font-pixel text-[6px] uppercase tracking-wider ${isOpen ? 'text-neon-sky/70' : 'text-neon-pink animate-pulse'
                                        }`}
                                >
                                    {isOpen ? '\u2713 READ' : '\u25B6 TAP TO UNSEAL'}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Return to Hub */}
            <div className="mt-10 flex flex-col items-center">
                <Link
                    to="/hub"
                    className="font-pixel text-[9px] uppercase px-5 py-2.5 border-2 border-neon-sky text-neon-sky bg-navy-900/90 hover:bg-neon-sky/20 transition-all shadow-[0_0_12px_rgba(56,189,248,0.3)] active:scale-95"
                    style={{ borderRadius: '2px' }}
                >
                    {'\u25C0'} Return to Mission Control
                </Link>
            </div>

            {/* Letter Reading Modal */}
            {selectedReason && (
                <div
                    onClick={handleCloseModal}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fade-in"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg bg-navy-900 border-2 border-neon-sky p-6 sm:p-8 shadow-[0_0_30px_rgba(56,189,248,0.3)] animate-scale-up"
                        style={{ borderRadius: '2px' }}
                    >
                        {/* Corner Decorative Brackets */}
                        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-pink" />
                        <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neon-pink" />
                        <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neon-pink" />
                        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-pink" />

                        {/* Letter Header */}
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

                        {/* Full Note Text */}
                        <div className="py-2 min-h-[120px] flex items-center">
                            <p className="font-body text-sm sm:text-base text-soft leading-relaxed">
                                "{selectedReason.message}"
                            </p>
                        </div>

                        {/* Bottom Modal Actions */}
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