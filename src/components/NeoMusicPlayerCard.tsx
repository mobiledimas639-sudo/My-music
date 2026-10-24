import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Heart, 
  Activity,
  Youtube,
  Radio,
  Sparkles
} from 'lucide-react';
import { Track, RepeatMode } from '../types/music';
import { formatTime } from '../services/musicApi';

interface NeoMusicPlayerCardProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isLiked: boolean;
  isYouTubeMode: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  onToggleLike: (track: Track) => void;
  onToggleYouTubeMode: () => void;
  onOpenYouTubeModal?: (track: Track) => void;
  onToggleSpectrum?: () => void;
}

export const NeoMusicPlayerCard: React.FC<NeoMusicPlayerCardProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  repeatMode,
  isLiked,
  isYouTubeMode,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onCycleRepeat,
  onToggleLike,
  onToggleYouTubeMode,
  onOpenYouTubeModal,
  onToggleSpectrum
}) => {
  if (!currentTrack) {
    return (
      <div className="neo-card p-6 md:p-8 bg-white text-center flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-full bg-[#FFE853] border-2 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_#18181b]">
          <Radio className="w-8 h-8 text-slate-900 animate-pulse" />
        </div>
        <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">
          Belum Ada Musik Yang Dipilih
        </h3>
        <p className="text-xs text-slate-600 max-w-md">
          Pilih lagu dari daftar atau gunakan pencarian untuk mulai mendengarkan audio 30 menit non-stop atau track favoritmu!
        </p>
      </div>
    );
  }

  const effectiveDuration = duration > 0 ? duration : (currentTrack.duration || 210);
  const progressPercent = effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;

  return (
    <div className="relative">
      {/* Clean Status Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#86E3CE] border border-slate-900 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono">
            LIVE PLAYER
          </span>
        </div>
        <div className="flex items-center gap-2">
          {effectiveDuration >= 1200 ? (
            <span className="neo-sticker bg-[#86E3CE] text-slate-900 text-[10px] py-0.5 px-2 rotate-[-2deg]">
              ⏱️ 30 MIN NON-STOP
            </span>
          ) : (
            <span className="neo-sticker bg-[#FFE853] text-slate-900 text-[10px] py-0.5 px-2 rotate-[-1deg]">
              ★ FULL TRACK
            </span>
          )}
          <span className="text-[11px] font-bold text-slate-500 font-mono hidden sm:inline">
            {isYouTubeMode ? 'YouTube Audio' : 'Direct Stream'}
          </span>
        </div>
      </div>

      {/* Main Neo-Brutalist Player Card */}
      <div className="neo-card p-4 sm:p-6 lg:p-7 bg-white relative overflow-visible">
        
        {/* Tilted NOW PLAYING sticker badge (As seen in reference image) */}
        <div className="absolute -top-3.5 left-4 sm:left-6 z-10">
          <span className="neo-sticker bg-[#FFE853] text-slate-900 text-[11px] sm:text-sm py-0.5 sm:py-1 px-3 sm:px-3.5 rotate-[-4deg] shadow-[2px_2px_0px_#18181b] sm:shadow-[3px_3px_0px_#18181b]">
            NOW PLAYING
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 pt-2">
          
          {/* Section 1: Artwork Thumbnail + Title + Artist */}
          <div className="flex items-center gap-3 sm:gap-5 w-full lg:w-auto shrink-0">
            {/* Album Artwork with rounded corners + vinyl disk peek */}
            <div className="relative group shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] relative z-10">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : ''}`}
                />
              </div>
              {/* Vinyl disk peeking out */}
              <div 
                className={`absolute -right-2 sm:-right-3 top-0.5 sm:top-1 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-slate-950 border-2 border-slate-900 z-0 transition-transform duration-500 ${
                  isPlaying ? 'translate-x-2.5 sm:translate-x-3 rotate-180' : 'group-hover:translate-x-2'
                }`}
                style={{
                  backgroundImage: 'radial-gradient(circle, #333 15%, #18181b 30%, #222 55%, #000 85%)'
                }}
              >
                <div className="absolute inset-0 m-auto w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FFE853] border-2 border-slate-900" />
              </div>
            </div>

            {/* Title & Artist info */}
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-lg lg:text-xl font-black uppercase text-slate-900 tracking-tight truncate">
                  {currentTrack.title}
                </h2>
              </div>
              
              <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                {/* Mini Artist Avatar */}
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden border border-slate-900 shrink-0">
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.artist}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">
                  {currentTrack.artist}
                </p>
                <span className="text-slate-400 text-xs hidden sm:inline">•</span>
                <span className="text-[11px] font-medium text-slate-500 truncate hidden sm:inline">
                  {currentTrack.album}
                </span>
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#86E3CE]/40 border border-slate-900 text-slate-900">
                  {currentTrack.genre || 'Electronic'}
                </span>
                <button
                  onClick={() => onToggleLike(currentTrack)}
                  title={isLiked ? 'Hapus dari Lagu Disukai' : 'Sukai Lagu Ini'}
                  className={`p-1 rounded-md border border-slate-900 transition-colors ${
                    isLiked ? 'bg-[#FF6F59] text-white' : 'bg-white text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Heart size={14} className={isLiked ? 'fill-white' : ''} />
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Controls, Timeline Scrubber & Equalizer Waveform */}
          <div className="flex-1 w-full max-w-xl flex flex-col items-center gap-3">
            
            {/* Playback Button Controls (As seen in reference image) */}
            <div className="flex items-center justify-center gap-3 sm:gap-5">
              {/* Shuffle */}
              <button
                onClick={onToggleShuffle}
                title={isShuffle ? 'Acak: Aktif' : 'Acak: Mati'}
                className={`p-2 rounded-full border-2 border-slate-900 transition-all ${
                  isShuffle 
                    ? 'bg-[#86E3CE] text-slate-950 shadow-[2px_2px_0px_#18181b]' 
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_#18181b]'
                }`}
              >
                <Shuffle size={15} />
              </button>

              {/* Previous */}
              <button
                onClick={onPrev}
                title="Lagu Sebelumnya"
                className="p-2 sm:p-2.5 rounded-full bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                <SkipBack size={18} className="fill-slate-900" />
              </button>

              {/* Big Play / Pause Button */}
              <button
                onClick={onTogglePlay}
                title={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
                className="p-3.5 sm:p-4 rounded-full bg-[#2B50D9] text-white border-2 border-slate-900 shadow-[3px_3px_0px_#18181b] hover:bg-[#2343b8] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                {isPlaying ? (
                  <Pause size={22} className="fill-white" />
                ) : (
                  <Play size={22} className="fill-white translate-x-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={onNext}
                title="Lagu Berikutnya"
                className="p-2 sm:p-2.5 rounded-full bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                <SkipForward size={18} className="fill-slate-900" />
              </button>

              {/* Repeat */}
              <button
                onClick={onCycleRepeat}
                title={`Ulangi: ${repeatMode}`}
                className={`p-2 rounded-full border-2 border-slate-900 transition-all ${
                  repeatMode !== 'off' 
                    ? 'bg-[#C8C4FC] text-slate-950 shadow-[2px_2px_0px_#18181b]' 
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_#18181b]'
                }`}
              >
                {repeatMode === 'one' ? <Repeat1 size={15} /> : <Repeat size={15} />}
              </button>
            </div>

            {/* Timeline Scrubber Bar with Current Time & Duration */}
            <div className="w-full flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-800 w-11 text-right select-none tabular-nums">
                {formatTime(currentTime)}
              </span>

              <div className="relative flex-1 flex items-center">
                <input
                  type="range"
                  min={0}
                  max={effectiveDuration || 100}
                  value={currentTime}
                  onChange={(e) => onSeek(Number(e.target.value))}
                  className="w-full neo-slider"
                  style={{
                    backgroundSize: `${progressPercent}% 100%`
                  }}
                />
              </div>

              <span className="text-xs font-mono font-bold text-slate-800 w-11 text-left select-none tabular-nums">
                {formatTime(effectiveDuration)}
              </span>
            </div>

            {/* Equalizer Waveform Bars in Multi-Color Pastel (From reference image) */}
            <div className="w-full flex items-center justify-between gap-1 h-6 px-1">
              {[
                { color: 'bg-[#FFE853]', anim: 'animate-neo-eq-1' },
                { color: 'bg-[#86E3CE]', anim: 'animate-neo-eq-2' },
                { color: 'bg-[#FF7E67]', anim: 'animate-neo-eq-3' },
                { color: 'bg-[#C8C4FC]', anim: 'animate-neo-eq-4' },
                { color: 'bg-[#2B50D9]', anim: 'animate-neo-eq-1' },
                { color: 'bg-[#FFE853]', anim: 'animate-neo-eq-2' },
                { color: 'bg-[#86E3CE]', anim: 'animate-neo-eq-3' },
                { color: 'bg-[#FF7E67]', anim: 'animate-neo-eq-4' },
                { color: 'bg-[#C8C4FC]', anim: 'animate-neo-eq-1' },
                { color: 'bg-[#2B50D9]', anim: 'animate-neo-eq-2' },
                { color: 'bg-[#FFE853]', anim: 'animate-neo-eq-3' },
                { color: 'bg-[#86E3CE]', anim: 'animate-neo-eq-4' },
                { color: 'bg-[#FF7E67]', anim: 'animate-neo-eq-1' },
                { color: 'bg-[#C8C4FC]', anim: 'animate-neo-eq-2' },
                { color: 'bg-[#2B50D9]', anim: 'animate-neo-eq-3' },
                { color: 'bg-[#FFE853]', anim: 'animate-neo-eq-4' },
                { color: 'bg-[#86E3CE]', anim: 'animate-neo-eq-1' },
                { color: 'bg-[#FF7E67]', anim: 'animate-neo-eq-2' },
                { color: 'bg-[#C8C4FC]', anim: 'animate-neo-eq-3' },
                { color: 'bg-[#2B50D9]', anim: 'animate-neo-eq-4' }
              ].map((bar, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full border border-slate-900 transition-all duration-75 ${bar.color} ${
                    isPlaying ? bar.anim : 'h-1.5'
                  }`}
                  style={{
                    animationDelay: `${(i % 5) * 0.15}s`
                  }}
                />
              ))}
            </div>

          </div>

          {/* Section 3: Volume Control & Tools */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200">
            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleMute}
                title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
                className="p-1.5 rounded-lg text-slate-800 hover:bg-slate-100 transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-20 sm:w-24 neo-slider"
              />
            </div>

            {/* YouTube Modal button */}
            {onOpenYouTubeModal && (
              <button
                onClick={() => onOpenYouTubeModal(currentTrack)}
                title="Buka Video Player Penuh"
                className="p-2 rounded-xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] hover:bg-red-50 text-red-600 transition-all"
              >
                <Youtube size={16} />
              </button>
            )}

            {/* Visualizer Spectrum trigger */}
            {onToggleSpectrum && (
              <button
                onClick={onToggleSpectrum}
                title="Buka Visualizer Spektrum Real-Time"
                className="p-2 rounded-xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] hover:bg-amber-100 text-slate-900 transition-all"
              >
                <Activity size={16} />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
