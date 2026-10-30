import React, { useState } from 'react';
import { 
  ChevronDown, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Heart, 
  Share2, 
  Music, 
  Film, 
  ListMusic, 
  Moon, 
  FileText, 
  Trash2, 
  Clock, 
  Volume2, 
  VolumeX, 
  Youtube,
  Plus
} from 'lucide-react';
import { Track } from '../types/music';
import { formatTime } from '../services/musicApi';
import { LyricsView } from './LyricsView';

interface FullPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLiked: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  queue: Track[];
  queueIndex: number;
  sleepTimerSetting: number | 'end_of_track' | null;
  sleepTimerRemaining: number | null;
  activeTab: 'player' | 'queue' | 'lyrics';
  setActiveTab: (tab: 'player' | 'queue' | 'lyrics') => void;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleLike: (track: Track) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onSelectTrack: (track: Track, newQueue?: Track[]) => void;
  onRemoveFromQueue: (index: number) => void;
  onClearQueue?: () => void;
  onOpenSleepTimer: () => void;
  onOpenYouTubeModal?: (track: Track) => void;
  onAddToPlaylist?: (track: Track) => void;
}

export const FullPlayerModal: React.FC<FullPlayerModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isLiked,
  isShuffle,
  repeatMode,
  queue,
  queueIndex,
  sleepTimerSetting,
  sleepTimerRemaining,
  activeTab,
  setActiveTab,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleLike,
  onToggleShuffle,
  onToggleRepeat,
  onSelectTrack,
  onRemoveFromQueue,
  onClearQueue,
  onOpenSleepTimer,
  onOpenYouTubeModal,
  onAddToPlaylist
}) => {
  const [mediaMode, setMediaMode] = useState<'audio' | 'video'>('audio');
  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen || !currentTrack) return null;

  const effectiveDuration = duration > 0 ? duration : (currentTrack.duration || 210);
  const progressPercent = effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${currentTrack.title} - ${currentTrack.artist}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FDFBF7] text-slate-900 animate-slideUp overflow-hidden">
      {/* Background Aesthetic Subtle Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      />

      {/* Top Header Bar */}
      <header className="relative z-10 shrink-0 px-4 py-3 sm:px-6 flex items-center justify-between border-b-2 border-slate-900 bg-white">
        <button
          onClick={onClose}
          title="Tutup / Perkecil"
          className="p-2 rounded-xl bg-white hover:bg-slate-100 border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 transition-all text-slate-800"
        >
          <ChevronDown size={20} />
        </button>

        <div className="text-center min-w-0 px-2 flex-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono block">
            Sedang Diputar
          </span>
          <h2 className="text-xs sm:text-sm font-black uppercase text-slate-900 truncate max-w-xs mx-auto">
            {currentTrack.title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenYouTubeModal && (
            <button
              onClick={() => onOpenYouTubeModal(currentTrack)}
              title="Putar Video YouTube"
              className="p-2 rounded-xl bg-red-500 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] hover:bg-red-600 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Youtube size={17} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 max-w-md sm:max-w-lg mx-auto w-full flex flex-col justify-between py-2 sm:py-3">
        
        {/* TAB 1: PLAYER VIEW */}
        {activeTab === 'player' && (
          <div className="flex-1 flex flex-col justify-center py-1 sm:py-2 space-y-3 sm:space-y-4">
            
            {/* Audio / Video Switcher Pill */}
            <div className="flex justify-center">
              <div className="inline-flex p-0.5 sm:p-1 bg-slate-100 border-2 border-slate-900 rounded-xl sm:rounded-2xl shadow-[1.5px_1.5px_0px_#18181b]">
                <button
                  onClick={() => setMediaMode('audio')}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black uppercase transition-all ${
                    mediaMode === 'audio'
                      ? 'bg-[#2B50D9] text-white shadow-[1px_1px_0px_#18181b]'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  <Music size={12} />
                  <span>Lagu</span>
                </button>
                <button
                  onClick={() => {
                    setMediaMode('video');
                    if (onOpenYouTubeModal) onOpenYouTubeModal(currentTrack);
                  }}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black uppercase transition-all ${
                    mediaMode === 'video'
                      ? 'bg-red-500 text-white shadow-[1px_1px_0px_#18181b]'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  <Film size={12} />
                  <span>Video</span>
                </button>
              </div>
            </div>

            {/* Poster / Album Cover Artwork (Responsively scaled for mobile) */}
            <div className="relative mx-auto w-44 h-44 xs:w-52 xs:h-52 sm:w-60 sm:h-60 md:w-68 md:h-68 shrink-0">
              <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-3 border-slate-900 shadow-[4px_4px_0px_#18181b] sm:shadow-[6px_6px_0px_#18181b] bg-slate-900 relative group">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isPlaying ? 'scale-105' : 'scale-100'
                  }`}
                />

                {/* Live Equalizer Overlay Badge */}
                {isPlaying && (
                  <div className="absolute top-2.5 left-2.5 bg-[#FFE853] text-slate-950 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl border border-slate-900 shadow-[1.5px_1.5px_0px_#18181b] flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Live</span>
                  </div>
                )}

                {/* Sleep timer pill badge if active */}
                {sleepTimerRemaining !== null && sleepTimerSetting !== null && (
                  <div className="absolute top-2.5 right-2.5 bg-[#86E3CE] text-slate-950 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl border border-slate-900 shadow-[1.5px_1.5px_0px_#18181b] flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold">
                    <Moon size={10} className="fill-slate-950" />
                    <span>{Math.ceil(sleepTimerRemaining / 60)}m</span>
                  </div>
                )}
              </div>
            </div>

            {/* Track Info & Action Icons */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl font-black uppercase text-slate-900 truncate tracking-tight">
                  {currentTrack.title}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-slate-500 truncate">
                  {currentTrack.artist}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onAddToPlaylist && (
                  <button
                    onClick={() => onAddToPlaylist(currentTrack)}
                    title="Tambah ke Playlist"
                    className="p-2 sm:p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    <Plus size={16} />
                  </button>
                )}

                <button
                  onClick={handleShare}
                  title="Bagikan Lagu"
                  className={`p-2 sm:p-2.5 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 transition-all ${
                    copiedShare ? 'bg-emerald-400 text-slate-950' : 'bg-white hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <Share2 size={16} />
                </button>

                <button
                  onClick={() => onToggleLike(currentTrack)}
                  title={isLiked ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                  className={`p-2 sm:p-2.5 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 transition-all ${
                    isLiked ? 'bg-[#FF6F59] text-white' : 'bg-white hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <Heart size={16} className={isLiked ? 'fill-white' : ''} />
                </button>
              </div>
            </div>

            {/* Timeline Progress Slider */}
            <div className="space-y-1.5 pt-1">
              <div 
                className="w-full bg-slate-200 h-3 rounded-full border-2 border-slate-900 overflow-hidden cursor-pointer relative shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  onSeek(pos * effectiveDuration);
                }}
              >
                <div 
                  className="h-full bg-[#FFE853] border-r-2 border-slate-900 transition-all duration-100"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(effectiveDuration)}</span>
              </div>
            </div>

            {/* Core Playback Controls (Shuffle, Prev, Play/Pause, Next, Repeat) */}
            <div className="flex items-center justify-between px-2 pt-2 sm:pt-4">
              <button
                onClick={onToggleShuffle}
                title="Acak Lagu"
                className={`p-2.5 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 transition-all ${
                  isShuffle ? 'bg-[#FFE853] text-slate-950' : 'bg-white text-slate-500 hover:text-slate-900'
                }`}
              >
                <Shuffle size={18} />
              </button>

              <button
                onClick={onPrev}
                title="Lagu Sebelumnya"
                className="p-3 rounded-2xl bg-white hover:bg-amber-50 text-slate-900 border-2 border-slate-900 shadow-[2.5px_2.5px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <SkipBack size={20} className="fill-slate-900" />
              </button>

              <button
                onClick={onTogglePlay}
                title={isPlaying ? 'Jeda' : 'Putar'}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-[#2B50D9] text-white border-3 border-slate-900 shadow-[4px_4px_0px_#18181b] flex items-center justify-center hover:bg-[#2343b8] active:translate-x-1 active:translate-y-1 transition-all"
              >
                {isPlaying ? (
                  <Pause size={28} className="fill-white" />
                ) : (
                  <Play size={28} className="fill-white translate-x-0.5" />
                )}
              </button>

              <button
                onClick={onNext}
                title="Lagu Berikutnya"
                className="p-3 rounded-2xl bg-white hover:bg-amber-50 text-slate-900 border-2 border-slate-900 shadow-[2.5px_2.5px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <SkipForward size={20} className="fill-slate-900" />
              </button>

              <button
                onClick={onToggleRepeat}
                title="Ulangi Lagu"
                className={`p-2.5 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 transition-all ${
                  repeatMode !== 'off' ? 'bg-[#86E3CE] text-slate-950' : 'bg-white text-slate-500 hover:text-slate-900'
                }`}
              >
                {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
              </button>
            </div>

            {/* Volume Control Bar */}
            <div className="flex items-center gap-3 px-4 pt-1 max-w-xs mx-auto w-full">
              <button
                onClick={onToggleMute}
                className="p-1 text-slate-600 hover:text-slate-950 transition-colors"
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
                className="w-full neo-slider cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 2: QUEUE VIEW */}
        {activeTab === 'queue' && (
          <div className="flex-1 flex flex-col py-2 space-y-4 h-[calc(100vh-210px)]">
            <div className="flex items-center justify-between pb-2 border-b-2 border-slate-200">
              <div className="flex items-center gap-2">
                <span className="neo-sticker bg-[#FFE853] text-slate-950 text-xs py-0.5 px-2">
                  DAFTAR ANTREAN ({queue.length})
                </span>
              </div>
              {onClearQueue && queue.length > 0 && (
                <button
                  onClick={onClearQueue}
                  className="text-xs font-black uppercase text-red-600 hover:text-red-700 flex items-center gap-1 font-mono transition-colors"
                >
                  <Trash2 size={13} />
                  <span>Bersihkan</span>
                </button>
              )}
            </div>

            {/* Current Song in Queue */}
            <div className="p-3.5 rounded-2xl bg-[#FFE853]/40 border-2 border-slate-900 shadow-[3px_3px_0px_#18181b] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover bg-slate-900 border-2 border-slate-900 shrink-0"
                />
                <div className="truncate">
                  <span className="text-[9px] font-mono font-black text-emerald-800 uppercase block">
                    ● Sedang Diputar
                  </span>
                  <div className="font-black text-xs sm:text-sm text-slate-950 truncate uppercase">
                    {currentTrack.title}
                  </div>
                  <div className="text-xs font-bold text-slate-600 truncate">
                    {currentTrack.artist}
                  </div>
                </div>
              </div>

              {/* Animated EQ Bars */}
              <div className="flex items-end gap-1 h-5 shrink-0 px-2">
                <span className={`w-1 rounded-full bg-[#2B50D9] ${isPlaying ? 'animate-neo-eq-1' : 'h-1.5'}`} />
                <span className={`w-1 rounded-full bg-[#FF7E67] ${isPlaying ? 'animate-neo-eq-2' : 'h-1.5'}`} />
                <span className={`w-1 rounded-full bg-[#86E3CE] ${isPlaying ? 'animate-neo-eq-3' : 'h-1.5'}`} />
              </div>
            </div>

            {/* Upcoming Track List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block pt-2">
                Akan Datang Berikutnya
              </span>

              {queue.length === 0 ? (
                <div className="py-12 text-center text-xs font-bold text-slate-400 border-2 border-dashed border-slate-300 rounded-2xl">
                  Tidak ada lagu lain dalam antrean.
                  <br />
                  Pilih lagu dari Beranda atau Cari untuk menambahkan!
                </div>
              ) : (
                queue.map((track, idx) => {
                  const isCurrent = track.id === currentTrack.id;

                  return (
                    <div
                      key={`${track.id}-${idx}`}
                      onClick={() => onSelectTrack(track, queue)}
                      className={`flex items-center justify-between p-2.5 rounded-2xl border-2 border-slate-900 transition-all cursor-pointer ${
                        isCurrent 
                          ? 'bg-[#FFE853] shadow-[3px_3px_0px_#18181b]' 
                          : 'bg-white hover:bg-amber-50/80 shadow-[2px_2px_0px_#18181b]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-5 text-center font-mono font-bold text-xs text-slate-400">
                          {idx + 1}
                        </span>
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover bg-slate-900 border border-slate-900 shrink-0"
                        />
                        <div className="truncate">
                          <div className="text-xs sm:text-sm font-black text-slate-950 truncate uppercase">
                            {track.title}
                          </div>
                          <div className="text-[11px] font-bold text-slate-500 truncate">
                            {track.artist}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs font-mono font-bold text-slate-600">
                          {formatTime(track.duration)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onRemoveFromQueue(idx);
                          }}
                          title="Hapus dari Antrean"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 active:scale-95 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: LYRICS VIEW */}
        {activeTab === 'lyrics' && (
          <div className="flex-1 h-[calc(100vh-210px)] py-2">
            <LyricsView
              track={currentTrack}
              currentTime={currentTime}
              onSeek={onSeek}
              isPlaying={isPlaying}
            />
          </div>
        )}

      </main>

      {/* Bottom Floating Control Pill (Antrean, Waktu Tidur, Lirik) */}
      <footer className="relative z-20 shrink-0 p-2 sm:p-2.5 bg-white/95 backdrop-blur-sm border-t-2 border-slate-900 flex justify-center">
        <div className="inline-flex items-center gap-1 p-1 bg-[#F7F4EB] rounded-2xl border-2 border-slate-900 shadow-[2.5px_2.5px_0px_#18181b]">
          
          {/* Antrean Pill Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'queue' ? 'player' : 'queue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black uppercase transition-all ${
              activeTab === 'queue'
                ? 'bg-[#FFE853] text-slate-950 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_#18181b]'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/80 border-2 border-transparent'
            }`}
          >
            <ListMusic size={13} />
            <span>Antrean</span>
          </button>

          {/* Waktu Tidur Pill Button */}
          <button
            onClick={onOpenSleepTimer}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black uppercase transition-all ${
              sleepTimerSetting !== null
                ? 'bg-[#86E3CE] text-slate-950 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_#18181b]'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/80 border-2 border-transparent'
            }`}
          >
            <Moon size={13} />
            <span>
              {sleepTimerRemaining !== null
                ? `${Math.ceil(sleepTimerRemaining / 60)}m`
                : 'Waktu tidur'}
            </span>
          </button>

          {/* Lirik Pill Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'lyrics' ? 'player' : 'lyrics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black uppercase transition-all ${
              activeTab === 'lyrics'
                ? 'bg-[#FF6F59] text-white border-2 border-slate-900 shadow-[1.5px_1.5px_0px_#18181b]'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/80 border-2 border-transparent'
            }`}
          >
            <FileText size={13} />
            <span>Lirik</span>
          </button>

        </div>
      </footer>
    </div>
  );
};
