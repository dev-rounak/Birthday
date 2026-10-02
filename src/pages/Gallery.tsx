import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { memories, gallery, dialogue } from '../config.js'
import { useBuddy } from '../context/BuddyContext'
import { useXP } from '../context/XPContext'
import { useMusic } from '../context/MusicContext'
import Lightbox, { type LightboxItem } from '../components/Lightbox'
import Sprite from '../components/Sprite'
import { sfx } from '../utils/sfx'

type FilterType = 'all' | 'photos' | 'videos'

export default function Gallery() {
    const navigate = useNavigate()
    const { say } = useBuddy()
    const { completeLevel, isLevelCompleted } = useXP()
    const { play } = useMusic()

    const [activeTab, setActiveTab] = useState<FilterType>('all')
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

    const combinedRaw: any[] = [
        ...(Array.isArray(gallery) ? gallery : []),
        ...(Array.isArray(memories) ? memories : []),
    ]

    const mediaList: LightboxItem[] = combinedRaw.map((item) => {
        const src = item?.src || item?.photo || item?.image || item?.video || item?.url || ''
        const isVideo = Boolean(
            item?.type === 'video' ||
            item?.video ||
            (typeof src === 'string' && (src.endsWith('.mp4') || src.endsWith('.webm') || src.includes('youtube')))
        )

        return {
            src,
            title: '',
            date: '',
            story: item?.story || item?.description || '',
            type: isVideo ? 'video' : 'image',
        }
    })

    useEffect(() => {
        const text =
            dialogue?.gallery?.text ||
            'Welcome to the Hall of Fame! Relive every special chapter.'
        say('sit', text, 'smile')

        try {
            play?.()
        } catch {
            // audio gesture fallback
        }

        // Automatically mark gallery cleared once visited
        if (!isLevelCompleted('gallery')) {
            completeLevel('gallery', 50)
        }
    }, [say, play, completeLevel, isLevelCompleted])

    const filteredList = mediaList.filter((item) => {
        if (activeTab === 'photos') return item.type === 'image'
        if (activeTab === 'videos') return item.type === 'video'
        return true
    })

    const openItem = (item: LightboxItem) => {
        sfx?.click?.()
        const originalIndex = mediaList.findIndex((m) => m.src === item.src)
        setLightboxIndex(originalIndex !== -1 ? originalIndex : 0)
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center select-none pb-24">
            {/* Sector Header */}
            <div className="text-center space-y-2 mb-6">
                <div className="font-pixel text-[8px] text-neon-pink uppercase tracking-widest">
                    {'◀'} SECTOR 03: HALL OF FAME {'▶'}
                </div>
                <h1 className="font-pixel text-xl sm:text-2xl text-soft uppercase tracking-wider">
                    Memory Vault
                </h1>
                <p className="font-body text-xs sm:text-sm text-soft/60">
                    Tap any photo to view in full screen
                </p>

                <div className="flex justify-center pt-1">
                    <Sprite name="sit" kind="poses" scale={2.4} />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6">
                {(['all', 'photos', 'videos'] as FilterType[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            sfx?.click?.()
                            setActiveTab(tab)
                        }}
                        className={`font-pixel text-[8px] sm:text-[9px] uppercase px-4 py-2 border transition-all ${activeTab === tab
                                ? 'border-neon-sky bg-neon-sky/20 text-neon-sky shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                                : 'border-neon-blue/40 bg-navy-900/60 text-soft/60 hover:text-soft'
                            }`}
                        style={{ borderRadius: '2px' }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 w-full">
                {filteredList.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => openItem(item)}
                        className="group relative cursor-pointer bg-navy-900/80 border-2 border-neon-blue/40 hover:border-neon-sky p-1.5 transition-all duration-300 hover:shadow-[0_0_16px_rgba(56,189,248,0.4)] hover:-translate-y-1"
                        style={{ borderRadius: '2px' }}
                    >
                        <div className="relative aspect-square overflow-hidden bg-navy-950 flex items-center justify-center">
                            {item.type === 'video' ? (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <video
                                        src={item.src}
                                        className="w-full h-full object-cover"
                                        muted
                                        playsInline
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <span className="font-pixel text-xs text-neon-sky">▶</span>
                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={item.src}
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sequential Navigation: Direct Link to Reasons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
                <Link
                    to="/hub"
                    className="font-pixel text-[8px] sm:text-[9px] uppercase px-4 py-2.5 border border-neon-blue/40 text-soft/70 bg-navy-900/90 hover:bg-neon-sky/10 transition-all"
                    style={{ borderRadius: '2px' }}
                >
                    {'◀'} Mission Control
                </Link>

                <button
                    onClick={() => {
                        sfx?.success?.()
                        navigate('/reasons')
                    }}
                    className="font-pixel text-[9px] sm:text-[10px] uppercase px-6 py-2.5 border-2 border-neon-pink text-neon-pink bg-navy-900 hover:bg-neon-pink/20 transition-all shadow-[0_0_16px_rgba(244,114,182,0.4)] active:scale-95 flex items-center gap-2"
                    style={{ borderRadius: '2px' }}
                >
                    <span>Next Sector: Reasons Why</span>
                    <span>▶</span>
                </button>
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <Lightbox
                    items={mediaList}
                    {...({ currentIndex: lightboxIndex, index: lightboxIndex } as any)}
                    onClose={() => setLightboxIndex(null)}
                />
            )}
        </div>
    )
}