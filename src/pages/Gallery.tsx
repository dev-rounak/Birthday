import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { memories, gallery, dialogue } from '../config.js'
import { useBuddy } from '../context/BuddyContext'
import { useXP } from '../context/XPContext'
import MediaFrame from '../components/MediaFrame'
import Lightbox, { type LightboxItem } from '../components/Lightbox'
import Sprite from '../components/Sprite'
import { sfx } from '../utils/sfx'

type FilterType = 'all' | 'photos' | 'videos'

export default function Gallery() {
    const { say } = useBuddy()
    const { completeLevel, isLevelCompleted } = useXP()

    const [activeTab, setActiveTab] = useState<FilterType>('all')
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

    // Merge items from config.gallery and config.memories into one unified collection
    const combinedRaw = [
        ...(Array.isArray(gallery) ? gallery : []),
        ...(Array.isArray(memories) ? memories : []),
    ]

    const mediaList: LightboxItem[] = combinedRaw.map((item, idx) => {
        const src = item.src || item.photo || item.image || item.video || item.url || ''
        const isVideo = Boolean(
            item.type === 'video' ||
            item.video ||
            src.endsWith('.mp4') ||
            src.endsWith('.webm') ||
            src.includes('youtube')
        )
        return {
            src,
            title: item.title || item.caption || `Record #${idx + 1}`,
            date: item.date || '',
            story: item.story || item.description || '',
            type: isVideo ? 'video' : 'photo',
        }
    })

    // Dialogue trigger on mount
    useEffect(() => {
        const text = dialogue?.gallery?.text || dialogue?.memories?.text || 'Welcome to the Hall of Fame! All the sweetest moments stored right here.'
        say('sit', text, 'smile')
    }, [say])

    // Filter items
    const filteredList = mediaList.filter((item) => {
        if (activeTab === 'photos') return item.type === 'photo'
        if (activeTab === 'videos') return item.type === 'video'
        return true
    })

    const openItem = (item: LightboxItem) => {
        sfx?.click?.()
        const originalIndex = mediaList.findIndex((m) => m.src === item.src)
        setLightboxIndex(originalIndex !== -1 ? originalIndex : 0)

        if (!isLevelCompleted('gallery')) {
            completeLevel('gallery', 50)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
            {/* Header */}
            <div className="text-center space-y-2 mb-6">
                <div className="font-pixel text-[8px] text-neon-pink uppercase tracking-widest">
                    {'\u25C0'} SECTOR: HALL OF FAME {'\u25B6'}
                </div>
                <h1 className="font-pixel text-xl sm:text-2xl text-soft uppercase tracking-wider">
                    Memory Vault
                </h1>
                <p className="font-body text-xs sm:text-sm text-soft/60">
                    Tap any photo or video to view in full screen
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

            {/* Unified Media Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 w-full">
                {filteredList.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => openItem(item)}
                        className="group relative cursor-pointer bg-navy-900/80 border-2 border-neon-blue/40 hover:border-neon-sky p-2 transition-all duration-300 hover:shadow-[0_0_16px_rgba(56,189,248,0.3)] hover:-translate-y-1"
                        style={{ borderRadius: '2px' }}
                    >
                        {/* Thumbnail */}
                        <div className="relative aspect-square overflow-hidden bg-navy-950 flex items-center justify-center">
                            <MediaFrame
                                src={item.src}
                                type={item.type}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {item.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <span className="font-pixel text-xs text-neon-sky">▶</span>
                                </div>
                            )}
                        </div>

                        {/* Title / Date info */}
                        <div className="mt-2 text-center">
                            <div className="font-pixel text-[7px] text-neon-sky uppercase truncate">
                                {item.title}
                            </div>
                            {item.date && (
                                <div className="font-pixel text-[6px] text-neon-pink/70 mt-0.5">
                                    {item.date}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Return Button */}
            <div className="mt-10 flex flex-col items-center gap-2">
                <Link
                    to="/hub"
                    className="font-pixel text-[9px] uppercase px-5 py-2.5 border-2 border-neon-sky text-neon-sky bg-navy-900/90 hover:bg-neon-sky/20 transition-all shadow-[0_0_12px_rgba(56,189,248,0.3)] active:scale-95"
                    style={{ borderRadius: '2px' }}
                >
                    {'\u25C0'} Return to Mission Control
                </Link>
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <Lightbox
                    items={mediaList}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}
        </div>
    )
}