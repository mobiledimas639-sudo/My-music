import React, { useState } from 'react';
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
  ListMusic, 
  Youtube,
  Radio,
  Activity,
  ChevronDown
} from 'lucide-react';
import { Track, RepeatMode } from '../types/music';
import { formatTime } from '../services/musicApi';
import { AudioSpectrumVisualizer } from './AudioSpectrumVisualizer';

interface LiquidPlayerBarProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isLiked: boolean;
  isQueueOpen: boolean;
  isYouTubeMode: boolean;
  getFrequencyData?: (array: Uint8Array) => void;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  onToggleLike: (track: Track) => void;
  onToggleQueue: () => void;
  onToggleYouTubeMode: () => void;
}

export const LiquidPlayerBar: React.FC<LiquidPlayerBarProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  repeatMode,
  isLiked,
  isQueueOpen,
  isYouTubeMode,
  getFrequencyData,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onCycleRepeat,
  onToggleLike,
  onToggleQueue,
  onToggleYouTubeMode
}) => {
  const [isVisualizerExpanded, setIsVisualizerExpanded] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  if (!currentTrack) {
    return (
      <div className="fixed bottom-2 left-2 right-2 sm:bottom-3 sm:left-4 sm:right-4 lg:left-6 lg:right-6 z-40 glass-panel-elevated rounded-2xl p-3 px-6 text-center text-xs text-slate-400 flex items-center justify-between border border-white/10 shadow-2xl">
        <div className="flex items-center gap-2 text-slate-400">
          <Radio size={16} className="text-emerald-400 animate-pulse" />
          <span>Pilih lagu dari daftar atau lakukan pencarian untuk memulai pemutaran.</span>
        </div>
        <span className="hidden sm:inline text-[11px] font-mono text-slate-500">Liquid Glass Audio Dock</span>
      </div>
    );
  }

  const effectiveDuration = duration > 0 ? duration : (currentTrack.duration || 30);
  const progressPercent = effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;

  return (
    <>
      {/* ============================================================== */}
      {/* 1. MAIN FLOATING DOCK BAR                                     */}
      {/* ============================================================== */}
      <div className="fixed bottom-2 left-2 right-2 sm:bottom-3 sm:left-4 sm:right-4 lg:left-6 lg:right-6 z-40 glass-panel-elevated rounded-2xl md:rounded-3xl border border-white/15 shadow-2xl transition-all overflow-hidden">
        
        {/* Top Slim Progress Line on Mobile */}
        <div className="md:hidden w-full h-1 bg-white/10 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-100"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>

        {/* ---------------- MOBILE COMPACT ROW (md:hidden) ---------------- */}
        <div className="flex md:hidden items-center justify-between p-2.5 px-3 gap-2">
          {/* Left: Thumbnail & Song Info (tap to expand full player) */}
          <div 
            onClick={() => setIsMobileSheetOpen(true)}
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-white/10 shadow-md">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-equalizer-1" />
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-equalizer-2" />
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-equalizer-3" />
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0 truncate">
              <div className="text-xs font-semibold text-white truncate">
                {currentTrack.title}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentTrack.artist}
              </div>
            </div>
          </div>

          {/* Right Mobile Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleLike(currentTrack)}
              className={`p-1.5 rounded-lg transition-colors ${
                isLiked ? 'text-violet-400' : 'text-slate-400'
              }`}
            >
              <Heart size={16} className={isLiked ? 'fill-violet-400' : ''} />
            </button>

            <button
              onClick={() => setIsVisualizerExpanded(prev => !prev)}
              title="Spektrum Visualizer"
              className={`p-1.5 rounded-lg transition-colors ${
                isVisualizerExpanded ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
              }`}
            >
              <Activity size={16} />
            </button>

            <button
              onClick={onPrev}
              title="Sebelumnya"
              className="p-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <SkipBack size={17} />
            </button>

            <button
              onClick={onTogglePlay}
              title={isPlaying ? 'Jeda' : 'Putar'}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause size={17} className="fill-slate-950" />
              ) : (
                <Play size={17} className="fill-slate-950 ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              title="Berikutnya"
              className="p-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <SkipForward size={17} />
            </button>
          </div>
        </div>

        {/* ---------------- DESKTOP & TABLET ROW (hidden md:flex) ---------------- */}
        <div className="hidden md:flex items-center justify-between p-3 px-6 gap-6">
          
          {/* Left Section: Track Info & Cover */}
          <div className="flex items-center gap-3 min-w-0 w-1/4 max-w-[280px]">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-white/10 shadow-md">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-equalizer-1" />
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-equalizer-2" />
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-equalizer-3" />
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0 truncate">
              <div className="text-sm font-semibold text-white truncate tracking-tight">
                {currentTrack.title}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {currentTrack.artist}
              </div>
            </div>

            <button
              onClick={() => onToggleLike(currentTrack)}
              title={isLiked ? 'Hapus dari Favorit' : 'Sukai Lagu'}
              className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                isLiked ? 'text-violet-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart size={16} className={isLiked ? 'fill-violet-400' : ''} />
            </button>
          </div>

          {/* Center Section: Playback Controls & Scrubber */}
          <div className="flex-1 max-w-xl flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-4 lg:gap-5">
              <button
                onClick={onToggleShuffle}
                title={isShuffle ? 'Acak Aktif' : 'Acak Nonaktif'}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  isShuffle ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shuffle size={16} />
              </button>

              <button
                onClick={onPrev}
                title="Lagu Sebelumnya"
                className="p-1.5 text-slate-300 hover:text-white hover:scale-105 active:scale-95 transition-all"
              >
                <SkipBack size={18} />
              </button>

              <button
                onClick={onTogglePlay}
                title={isPlaying ? 'Jeda' : 'Putar'}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? (
                  <Pause size={18} className="fill-slate-950" />
                ) : (
                  <Play size={18} className="fill-slate-950 ml-0.5" />
                )}
              </button>

              <button
                onClick={onNext}
                title="Lagu Berikutnya"
                className="p-1.5 text-slate-300 hover:text-white hover:scale-105 active:scale-95 transition-all"
              >
                <SkipForward size={18} />
              </button>

              <button
                onClick={onCycleRepeat}
                title={`Mode Ulang: ${repeatMode}`}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  repeatMode !== 'off' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
              </button>
            </div>

            {/* Scrubber & Time */}
            <div className="w-full flex items-center gap-2.5 text-[11px] font-mono tabular-nums text-slate-400">
              <span className="w-9 text-right shrink-0">{formatTime(currentTime)}</span>
              
              <div className="relative flex-1 flex items-center h-4 group cursor-pointer">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 group-hover:from-emerald-400 transition-all rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={effectiveDuration}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => onSeek(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <span className="w-9 text-left shrink-0">{formatTime(effectiveDuration)}</span>
            </div>
          </div>

          {/* Right Section: Real-Time Spectrum Visualizer, YouTube, Queue, Volume */}
          <div className="flex items-center justify-end gap-2.5 lg:gap-3 w-1/4 max-w-[280px]">
            <AudioSpectrumVisualizer
              isPlaying={isPlaying}
              getFrequencyData={getFrequencyData}
              trackTitle={currentTrack.title}
              artist={currentTrack.artist}
              isExpanded={isVisualizerExpanded}
              onToggleExpand={() => setIsVisualizerExpanded(prev => !prev)}
            />

            <button
              onClick={onToggleYouTubeMode}
              title="Mode Video YouTube"
              className={`p-2 rounded-xl text-xs transition-all ${
                isYouTubeMode 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                  : 'text-slate-400 hover:text-rose-400 hover:bg-white/5'
              }`}
            >
              <Youtube size={17} />
            </button>

            <button
              onClick={onToggleQueue}
              title="Buka Antrean Putar"
              className={`p-2 rounded-xl text-xs transition-all ${
                isQueueOpen
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ListMusic size={17} />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group">
              <button
                onClick={onToggleMute}
                title={isMuted ? 'Batal Senyap' : 'Senyap'}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
              <div className="w-16 lg:w-20 relative flex items-center h-4 cursor-pointer">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-300 group-hover:bg-emerald-400 rounded-full"
                    style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MOBILE FULL-SCREEN EXPANDED PLAYER SHEET                    */}
      {/* ============================================================== */}
      {isMobileSheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-950/95 backdrop-blur-2xl flex flex-col p-6 animate-slideUp overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4">
            <button
              onClick={() => setIsMobileSheetOpen(false)}
              className="p-2 text-slate-300 hover:text-white rounded-xl bg-white/5"
            >
              <ChevronDown size={22} />
            </button>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sedang Diputar
            </span>
            <button
              onClick={() => onToggleLike(currentTrack)}
              className={`p-2 rounded-xl transition-colors ${
                isLiked ? 'text-violet-400' : 'text-slate-300'
              }`}
            >
              <Heart size={20} className={isLiked ? 'fill-violet-400' : ''} />
            </button>
          </div>

          {/* Large Artwork */}
          <div className="my-auto py-4 flex flex-col items-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-slate-900">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Song Meta */}
            <div className="mt-6 text-center space-y-1 w-full px-4">
              <h2 className="text-xl font-bold text-white tracking-tight truncate">
                {currentTrack.title}
              </h2>
              <p className="text-sm text-slate-400 truncate">
                {currentTrack.artist}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {currentTrack.album} · {currentTrack.genre || 'Music'}
              </p>
            </div>
          </div>

          {/* Bottom Controls inside Sheet */}
          <div className="space-y-4 pt-4">
            {/* Scrubber & Time */}
            <div className="space-y-1">
              <div className="relative flex items-center h-4 cursor-pointer">
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={effectiveDuration}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => onSeek(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-400 px-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(effectiveDuration)}</span>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between px-4">
              <button
                onClick={onToggleShuffle}
                className={`p-2 transition-colors ${
                  isShuffle ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                <Shuffle size={20} />
              </button>

              <button
                onClick={onPrev}
                className="p-2 text-white active:scale-95 transition-all"
              >
                <SkipBack size={26} />
              </button>

              <button
                onClick={onTogglePlay}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/40 active:scale-95 transition-all"
              >
                {isPlaying ? (
                  <Pause size={28} className="fill-slate-950" />
                ) : (
                  <Play size={28} className="fill-slate-950 ml-1" />
                )}
              </button>

              <button
                onClick={onNext}
                className="p-2 text-white active:scale-95 transition-all"
              >
                <SkipForward size={26} />
              </button>

              <button
                onClick={onCycleRepeat}
                className={`p-2 transition-colors ${
                  repeatMode !== 'off' ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
              </button>
            </div>

            {/* Secondary actions: Spectrum Visualizer & YouTube */}
            <div className="flex items-center justify-center gap-4 pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setIsMobileSheetOpen(false);
                  setIsVisualizerExpanded(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-emerald-400"
              >
                <Activity size={15} />
                <span>Buka Spektrum</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileSheetOpen(false);
                  onToggleYouTubeMode();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-xs text-rose-300"
              >
                <Youtube size={15} />
                <span>Mode Video YouTube</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
