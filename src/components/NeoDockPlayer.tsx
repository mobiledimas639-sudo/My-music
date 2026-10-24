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
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleLike,
  onToggleYouTubeMode,
  onOpenYouTubeModal,
  onToggleSpectrum
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
      className="fixed bottom-[60px] sm:bottom-4 left-2 right-2 sm:left-6 sm:right-6 lg:left-10 lg:right-10 max-w-5xl mx-auto z-30 bg-white border-2 border-slate-900 rounded-xl sm:rounded-2xl shadow-[4px_4px_0px_#18181b] overflow-hidden transition-all"
    >
      {/* Top Scrubber Line */}
      <div className="w-full bg-slate-200 h-1.5 cursor-pointer relative" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        onSeek(pos * effectiveDuration);
      }}>
        <div 
          className="h-full bg-[#FFE853] border-r-2 border-slate-900 transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="p-2 sm:p-3 px-2.5 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 md:gap-6">
        
        {/* Left: Thumbnail & Song Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
          <div className="relative shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-900 shadow-[1px_1px_0px_#18181b]">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover ${isPlaying ? 'scale-105' : ''}`}
              />
            </div>
            {isPlaying && (
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-[#86E3CE] border border-slate-900 animate-ping" />
            )}
          </div>

          <div className="min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-sm font-black uppercase text-slate-900 truncate max-w-[115px] xs:max-w-[170px] sm:max-w-xs md:max-w-none">
                {currentTrack.title}
              </h4>
              <span className="neo-sticker bg-[#FFE853] text-slate-900 text-[8px] sm:text-[9px] py-0 px-1 hidden md:inline-flex">
                PLAYING
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 truncate max-w-[115px] xs:max-w-[170px] sm:max-w-xs md:max-w-none">
              {currentTrack.artist}
            </p>
          </div>

          <button
            onClick={() => onToggleLike(currentTrack)}
            title={isLiked ? 'Hapus Like' : 'Sukai Lagu'}
            className={`p-1.5 rounded-lg border border-slate-900 hidden sm:block ${
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

          {/* Visualizer button */}
          {onToggleSpectrum && (
            <button
              onClick={onToggleSpectrum}
              title="Buka Visualizer Spektrum"
              className="p-1.5 rounded-xl bg-white text-slate-900 border-2 border-slate-900 shadow-[1px_1px_0px_#18181b] hover:bg-amber-100"
            >
              <Activity size={15} />
            </button>
          )}

          {/* YouTube Video Modal Button */}
          {onOpenYouTubeModal && (
            <button
              onClick={() => onOpenYouTubeModal(currentTrack)}
              title="Tonton di YouTube"
              className="p-1.5 rounded-xl bg-white text-red-600 border-2 border-slate-900 shadow-[1px_1px_0px_#18181b] hover:bg-red-50"
            >
              <Youtube size={15} />
            </button>
          )}
        </div>

      </div>
    </aside>
  );
};
