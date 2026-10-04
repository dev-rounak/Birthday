import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { memories, gallery, videos, dialogue } from '../config.js'
import { useBuddy } from '../context/BuddyContext'
import { useXP } from '../context/XPContext'
import Lightbox, { type LightboxItem } from '../components/Lightbox'
import Sprite from '../components/Sprite'
import { sfx } from '../utils/sfx'

interface GalleryPhoto {
    src: string
    title: string
    date?: string
    story?: string
}

// Robust YouTube Embed Parser (handles standard, shorts, youtu.be, embed formats)
function getYouTubeEmbedUrl(url: string): string | null {
    if (!url || typeof url !== 'string') return null
    const trimmed = url.trim()

    const match = trimmed.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
    )
    if (match && match[1]) {
        return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=0&rel=0`
    }

    if (trimmed.includes('youtube.com/embed/')) {
        return trimmed
    }

    return null
}

export default function Gallery() {
    const navigate = useNavigate()
    const { say } = useBuddy()
    const { completeLevel, isLevelCompleted } = useXP()

    // Only 'video' and 'photos' tabs
    const [activeTab, setActiveTab] = useState<'video' | 'photos'>('video')
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    const videoRef = useRef<HTMLVideoElement | null>(null)

    // 1. Video detection across config objects
    const rawVideos: any[] = Array.isArray(videos) ? (videos as any[]) : []
    const rawGallery: any[] = Array.isArray(gallery) ? (gallery as any[]) : []
    const rawMemories: any[] = Array.isArray(memories) ? (memories as any[]) : []

    const detectedVideo =
        rawVideos.find((v: any) => v?.src || v?.url) ||
        rawGallery.find(
            (g: any) =>
                g?.type === 'video' ||
                (typeof g?.src === 'string' &&
                    (g.src.includes('.mp4') || g.src.includes('youtu') || g.src.includes('.webm')))
        ) ||
        rawMemories.find(
            (m: any) =>
                m?.type === 'video' ||
                (typeof m?.src === 'string' &&
                    (m.src.includes('.mp4') || m.src.includes('youtu') || m.src.includes('.webm')))
        )

    const videoSourceUrl: string = String(
        detectedVideo?.src || detectedVideo?.url || '/assets/gallery/video.mp4'
    ).trim()

    const ytEmbedUrl = getYouTubeEmbedUrl(videoSourceUrl)

    // 2. Photos List: Captions always set to "You"
    const rawCombined: any[] = [...rawGallery, ...rawMemories]

    const photoList: GalleryPhoto[] = rawCombined
        .filter((item: any) => {
            const s = String(item?.src || item?.photo || item?.image || '')
            const isVid =
                item?.type === 'video' ||
                s.endsWith('.mp4') ||
                s.endsWith('.webm') ||
                s.includes('youtu')
            return !isVid && s.trim().length > 0
        })
        .map((item: any, idx: number) => ({
            src: item?.src || item?.photo || item?.image || `/assets/gallery/photo${idx + 1}.jpg`,
            title: 'You',
            date: item?.date || '',
            story: 'You',
        }))

    const lightboxItems: LightboxItem[] = photoList.map((p) => ({
        src: p.src,
        caption: 'You',
        title: 'You',
        date: p.date,
        story: '',
        type: 'photo',
    } as any))

    useEffect(() => {
        const text =
            dialogue?.gallery?.text ||
            'Welcome to the Hall of Fame! Relive every special chapter.'
        say('sit', text, 'smile')

        if (!isLevelCompleted('gallery')) {
            completeLevel('gallery', 50)
        }
    }, [say, completeLevel, isLevelCompleted])

    const openPhoto = (idx: number) => {
        sfx?.click?.()
        setLightboxIndex(idx)
    }

    const toggleLocalVideo = () => {
        if (!videoRef.current) return
        if (videoRef.current.paused) {
            videoRef.current.play()
            setIsVideoPlaying(true)
        } else {
            videoRef.current.pause()
            setIsVideoPlaying(false)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center select-none pb-28">
            {/* Sector Header */}
            <div className="text-center space-y-2 mb-6">
                <div className="font-pixel text-[8px] text-neon-pink uppercase tracking-widest">
                    {'◀'} SECTOR 03: HALL OF FAME {'▶'}
                </div>
                <h1 className="font-pixel text-xl sm:text-2xl text-soft uppercase tracking-wider">
                    Memory Vault & Theater
                </h1>
                <p className="font-body text-xs sm:text-sm text-soft/60">
                    Declassified Birthday Visuals
                </p>

                <div className="flex justify-center pt-1">
                    <Sprite name="sit" kind="poses" scale={2.4} />
                </div>
            </div>

            {/* Tabs: ONLY VIDEO AND PHOTOS */}
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={() => {
                        sfx?.click?.()
                        setActiveTab('video')
                    }}
                    className={`font-pixel text-[8px] sm:text-[9px] uppercase px-5 py-2.5 border transition-all ${activeTab === 'video'
                            ? 'border-neon-sky bg-neon-sky/20 text-neon-sky shadow-[0_0_14px_rgba(56,189,248,0.4)]'
                            : 'border-neon-blue/40 bg-navy-900/60 text-soft/60 hover:text-soft'
                        }`}
                    style={{ borderRadius: '2px' }}
                >
                    ▶ VIDEO THEATER
                </button>

                <button
                    onClick={() => {
                        sfx?.click?.()
                        setActiveTab('photos')
                    }}
                    className={`font-pixel text-[8px] sm:text-[9px] uppercase px-5 py-2.5 border transition-all ${activeTab === 'photos'
                            ? 'border-neon-pink bg-neon-pink/20 text-neon-pink shadow-[0_0_14px_rgba(244,114,182,0.4)]'
                            : 'border-neon-blue/40 bg-navy-900/60 text-soft/60 hover:text-soft'
                        }`}
                    style={{ borderRadius: '2px' }}
                >
                    ▣ PHOTOS ({photoList.length})
                </button>
            </div>

            {/* ========================================================================= */}
            {/* 📺 TAB 1: RETRO YOUTUBE-STYLE VIDEO THEATER */}
            {/* ========================================================================= */}
            {activeTab === 'video' && (
                <div className="w-full max-w-2xl">
                    <div
                        className="bg-navy-900/95 border-2 border-neon-sky p-3 sm:p-4 shadow-[0_0_30px_rgba(56,189,248,0.25)] relative"
                        style={{ borderRadius: '2px' }}
                    >
                        <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-neon-pink pointer-events-none" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-neon-pink pointer-events-none" />
                        <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-neon-pink pointer-events-none" />
                        <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-neon-pink pointer-events-none" />

                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neon-sky/30">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="font-pixel text-[8px] sm:text-[9px] text-red-400 uppercase tracking-wider">
                                    YT • RETRO PLAYER // BROADCAST
                                </span>
                            </div>
                            <span className="font-pixel text-[6px] text-neon-sky uppercase">
                                1080P • CH-01
                            </span>
                        </div>

                        <div className="relative aspect-video w-full bg-black border border-neon-sky/40 overflow-hidden flex items-center justify-center">
                            {ytEmbedUrl ? (
                                <iframe
                                    src={ytEmbedUrl}
                                    title="YouTube video player"
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="relative w-full h-full flex items-center justify-center bg-black">
                                    <video
                                        ref={videoRef}
                                        src={videoSourceUrl}
                                        controls
                                        playsInline
                                        className="w-full h-full object-contain"
                                        onPlay={() => setIsVideoPlaying(true)}
                                        onPause={() => setIsVideoPlaying(false)}
                                    >
                                        Your browser does not support HTML video.
                                    </video>
                                    {!isVideoPlaying && (
                                        <button
                                            type="button"
                                            onClick={toggleLocalVideo}
                                            className="absolute inset-0 m-auto w-14 h-14 bg-red-600/90 hover:bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-white text-xl pl-1 shadow-[0_0_20px_rgba(239,68,68,0.8)] transition-all cursor-pointer"
                                            title="Play Tape"
                                        >
                                            ▶
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-neon-sky/20">
                            <div>
                                <h3 className="font-pixel text-[10px] sm:text-xs text-soft uppercase tracking-wide">
                                    You
                                </h3>
                                <p className="font-body text-xs text-soft/60 mt-0.5">
                                    Our Special Video Tape
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-pixel text-[7px] text-neon-pink px-2 py-1 bg-navy-950 border border-neon-pink/40">
                                    ♥ FAVORITE
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* 📸 TAB 2: PHOTOS ARCHIVE GRID (CAPTIONS ALWAYS SAY "You") */}
            {/* ========================================================================= */}
            {activeTab === 'photos' && (
                <div className="w-full">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 w-full">
                        {photoList.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => openPhoto(idx)}
                                className="group relative cursor-pointer bg-navy-900/80 border-2 border-neon-blue/40 hover:border-neon-sky p-1.5 transition-all duration-300 hover:shadow-[0_0_16px_rgba(56,189,248,0.4)] hover:-translate-y-1"
                                style={{ borderRadius: '2px' }}
                            >
                                <div className="relative aspect-square overflow-hidden bg-navy-950 flex items-center justify-center">
                                    <img
                                        src={item.src}
                                        alt="You"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="mt-2 text-center">
                                    <span className="font-pixel text-[7px] text-soft/80 group-hover:text-neon-sky truncate block">
                                        You
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sequential Mission Advance */}
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-3">
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
                    items={lightboxItems}
                    {...({ currentIndex: lightboxIndex, index: lightboxIndex } as any)}
                    onClose={() => setLightboxIndex(null)}
                />
            )}
        </div>
    )
}