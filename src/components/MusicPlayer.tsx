import { useMusic } from '../context/MusicContext'
import { music } from '../config.js'

export default function MusicPlayer() {
  const { currentTrack, isPlaying, play, pause, volume, setVolume } = useMusic()

  const togglePlay = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  // Resolve song title whether currentTrack is a number index or an object
  const activeTrackObj =
    typeof currentTrack === 'number'
      ? music?.[currentTrack]
      : (currentTrack as any)

  const songTitle = activeTrackObj?.title || 'Our Song'

  return (
    <div
      className="fixed bottom-3 right-3 z-40 flex items-center gap-2.5 px-3 py-1.5 bg-navy-950/90 backdrop-blur-md border border-neon-pink/70 shadow-[0_0_14px_rgba(244,114,182,0.35)] select-none"
      style={{ borderRadius: '2px' }}
    >
      {/* Play / Pause Toggle Button */}
      <button
        type="button"
        onClick={togglePlay}
        className="flex items-center justify-center w-6 h-6 border border-neon-pink/80 bg-navy-900 text-neon-pink hover:bg-neon-pink/20 transition-all active:scale-95 flex-shrink-0"
        style={{ borderRadius: '2px' }}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        <span className="font-pixel text-[9px] leading-none">
          {isPlaying ? '❚❚' : '▶'}
        </span>
      </button>

      {/* Song Title Display */}
      <div className="flex items-center gap-1.5 min-w-[70px] max-w-[130px] overflow-hidden">
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-soft/40'
            }`}
        />
        <span className="font-pixel text-[7px] text-soft truncate uppercase tracking-wider">
          {songTitle}
        </span>
      </div>

      {/* Mini Volume Control */}
      <div className="flex items-center gap-1 pl-1 border-l border-neon-pink/30">
        <span className="font-pixel text-[6px] text-neon-pink uppercase">
          VOL
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-14 sm:w-16 h-1 accent-neon-pink cursor-pointer bg-navy-800"
          title={`Volume: ${Math.round(volume * 100)}%`}
        />
      </div>
    </div>
  )
}