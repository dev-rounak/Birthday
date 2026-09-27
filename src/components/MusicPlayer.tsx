import Sprite from './Sprite'
import { useMusic } from '../context/MusicContext'
import { music } from '../config.js'
import { sfx } from '../utils/sfx'

export default function MusicPlayer() {
  const { isPlaying, currentTrack, volume, toggle, next, prev, setVolume } = useMusic()

  const track = music[currentTrack]
  if (!track) return null

  return (
    <div
      className="fixed right-3 bottom-16 md:bottom-4 z-40 select-none"
    >
      <div
        className="relative bg-navy-800/90 backdrop-blur-md border-2 border-neon-pink/40 p-2 flex flex-col gap-2"
        style={{
          borderRadius: '2px',
          boxShadow: '0 0 12px rgba(244, 114, 182, 0.2)',
        }}
      >
        {/* Corner brackets */}
        <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-pink pointer-events-none" />
        <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-pink pointer-events-none" />
        <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-pink pointer-events-none" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-pink pointer-events-none" />

        {/* Top row: icon + track name */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => { sfx.click(); toggle() }}
            className="cursor-pointer flex-shrink-0"
            role="button"
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { sfx.click(); toggle() } }}
          >
            <Sprite name="headphones" kind="props" scale={2} />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-pixel text-[6px] text-neon-pink/70 uppercase tracking-wider">
              {isPlaying ? 'NOW PLAYING' : 'PAUSED'}
            </span>
            <span className="font-body text-[11px] text-soft/80 truncate max-w-[120px]">
              {track.title}
            </span>
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { sfx.click(); prev() }}
            className="font-pixel text-[10px] text-neon-sky/70 hover:text-neon-sky transition-colors"
            aria-label="Previous track"
          >
            {'\u25C0'}
          </button>
          <button
            onClick={() => { sfx.click(); toggle() }}
            className="font-pixel text-[12px] text-neon-pink hover:text-neon-sky transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '\u275A\u275A' : '\u25B6'}
          </button>
          <button
            onClick={() => { sfx.click(); next() }}
            className="font-pixel text-[10px] text-neon-sky/70 hover:text-neon-sky transition-colors"
            aria-label="Next track"
          >
            {'\u25B6'}
          </button>

          {/* Volume slider */}
          <div className="flex items-center gap-1 ml-1">
            <span className="font-pixel text-[6px] text-soft/40">VOL</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              className="w-16 h-1 accent-neon-pink cursor-pointer"
              aria-label="Volume"
            />
          </div>
        </div>

        {/* Track counter */}
        <div className="font-pixel text-[6px] text-soft/40 text-center">
          {currentTrack + 1} / {music.length}
        </div>
      </div>
    </div>
  )
}
