import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Heart, 
  Activity, 
  Youtube,
  Radio,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Track } from '../types/music';
import { formatTime } from '../services/musicApi';

interface NeoDockPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLiked: boolean;
  isYouTubeMode: boolean;
  sleepTimerRemaining?: number | null;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleLike: (track: Track) => void;
  onToggleYouTubeMode: () => void;
  onOpenYouTubeModal?: (track: Track) => void;
  onToggleSpectrum?: () => void;
  onOpenFullPlayer?: () => void;
}

export const NeoDockPlayer: React.FC<NeoDockPlayerProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isLiked,
  isYouTubeMode,
  sleepTimerRemaining,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleLike,
  onToggleYouTubeMode,
  onOpenYouTubeModal,
  onToggleSpectrum,
  onOpenFullPlayer
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentTrack) {
    return null;
  }

  const effectiveDuration = duration > 0 ? duration : (currentTrack.duration || 210);
  const progressPercent = effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;

  return (
    <aside 
      aria-label="Pemutar Audio Mengambang"
      className="fixed bottom-[58px] sm:bottom-[64px] md:bottom-[70px] left-2.5 right-2.5 sm:left-4 sm:right-4 md:left-6 md:right-6 max-w-3xl mx-auto z-40 bg-white/95 backdrop-blur-md border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_#18181b] overflow-hidden transition-all"
    >
      {/* Top Scrubber Line */}
      <div className="w-full bg-slate-200 h-1 cursor-pointer relative" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        onSeek(pos * effectiveDuration);
      }}>
        <div 
          className="h-full bg-[#FFE853] border-r-2 border-slate-900 transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="p-1.5 sm:p-2.5 px-3 sm:px-5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Thumbnail & Song Info (Clickable to open Full Player) */}
        <div 
          onClick={() => onOpenFullPlayer?.()}
          className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 cursor-pointer group/track select-none"
          title="Ketuk untuk membuka pemutar penuh, antrean, waktu tidur, & lirik"
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-900 shadow-[1px_1px_0px_#18181b] group-hover/track:scale-105 transition-transform">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover ${isPlaying ? 'scale-105' : ''}`}
              />
            </div>
            {isPlaying && (
              <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
            )}
          </div>

          <div className="min-w-0 pr-1 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-sm font-black uppercase text-slate-900 truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs md:max-w-none group-hover/track:text-[#2B50D9] transition-colors">
                {currentTrack.title}
              </h4>
              <span className="neo-sticker bg-[#FFE853] text-slate-900 text-[8px] py-0 px-1 hidden md:inline-flex">
                PLAYING
              </span>
              {/* Active Sleep Timer badge indicator */}
              {sleepTimerRemaining !== null && sleepTimerRemaining !== undefined && (
                <span className="inline-flex items-center gap-0.5 text-[8px] sm:text-[9px] font-mono font-bold bg-[#86E3CE] text-slate-950 px-1.5 py-0.2 rounded border border-slate-900">
                  🌙 {Math.ceil(sleepTimerRemaining / 60)}m
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs md:max-w-none">
                {currentTrack.artist}
              </p>
              <span className="text-[9px] font-mono font-bold text-slate-400 hidden xs:inline flex items-center gap-0.5">
                • <ChevronUp size={10} className="inline text-slate-500" /> Buka
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(currentTrack);
            }}
            title={isLiked ? 'Hapus Like' : 'Sukai Lagu'}
            className={`p-1.5 rounded-lg border border-slate-900 hidden sm:block shrink-0 ${
              isLiked ? 'bg-[#FF6F59] text-white' : 'bg-white text-slate-600 hover:text-slate-950'
            }`}
          >
            <Heart size={13} className={isLiked ? 'fill-white' : ''} />
          </button>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            onClick={onPrev}
            title="Lagu Sebelumnya"
            className="p-1 sm:p-1.5 rounded-full bg-white text-slate-900 border-2 border-slate-900 shadow-[1px_1px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 hidden xs:block"
          >
            <SkipBack size={13} className="fill-slate-900" />
          </button>

          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'Jeda' : 'Putar'}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#2B50D9] text-white border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] flex items-center justify-center hover:bg-[#2343b8] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            {isPlaying ? (
              <Pause size={15} className="fill-white" />
            ) : (
              <Play size={15} className="fill-white translate-x-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            title="Lagu Berikutnya"
            className="p-1 sm:p-1.5 rounded-full bg-white text-slate-900 border-2 border-slate-900 shadow-[1px_1px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5"
          >
            <SkipForward size={13} className="fill-slate-900" />
          </button>

          {/* Time Scrubber readout on tablet+ */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono font-bold text-slate-700 pl-2">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(effectiveDuration)}</span>
          </div>
        </div>

        {/* Right: Equalizer / Volume / Spectrum */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Animated Mini Equalizer Bars */}
          <div className="hidden md:flex items-end gap-1 h-5 w-10">
            <span className={`w-1.5 rounded-full bg-[#FFE853] border border-slate-900 ${isPlaying ? 'animate-neo-eq-1' : 'h-1.5'}`} />
            <span className={`w-1.5 rounded-full bg-[#86E3CE] border border-slate-900 ${isPlaying ? 'animate-neo-eq-2' : 'h-1.5'}`} />
            <span className={`w-1.5 rounded-full bg-[#FF7E67] border border-slate-900 ${isPlaying ? 'animate-neo-eq-3' : 'h-1.5'}`} />
            <span className={`w-1.5 rounded-full bg-[#2B50D9] border border-slate-900 ${isPlaying ? 'animate-neo-eq-4' : 'h-1.5'}`} />
          </div>

          {/* Volume slider */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={onToggleMute}
              className="p-1 text-slate-700 hover:text-slate-950"
            >
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-16 neo-slider"
            />
          </div>

          {/* Visualizer button (shown on sm+) */}
          {onToggleSpectrum && (
            <button
              onClick={onToggleSpectrum}
              title="Buka Visualizer Spektrum"
              className="p-1.5 rounded-xl bg-white text-slate-900 border-2 border-slate-900 shadow-[1px_1px_0px_#18181b] hover:bg-amber-100 hidden sm:block"
            >
              <Activity size={15} />
            </button>
          )}

          {/* YouTube Video Modal Button (shown on sm+) */}
          {onOpenYouTubeModal && (
            <button
              onClick={() => onOpenYouTubeModal(currentTrack)}
              title="Tonton di YouTube"
              className="p-1.5 rounded-xl bg-white text-red-600 border-2 border-slate-900 shadow-[1px_1px_0px_#18181b] hover:bg-red-50 hidden sm:block"
            >
              <Youtube size={15} />
            </button>
          )}
        </div>

      </div>
    </aside>
  );
};
