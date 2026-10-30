import React, { useMemo, useRef } from 'react';
import { Sparkles, Radio, Flame, Clock, Heart, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Track, Playlist, ActiveView, RepeatMode } from '../types/music';
import { REFERENCE_TRACKS, DEFAULT_FEATURED_TRACKS } from '../data/defaultCatalog';
import { NeoMusicPlayerCard } from './NeoMusicPlayerCard';
import { NeoRecentlyPlayed } from './NeoRecentlyPlayed';
import { NeoStickersAndAlert } from './NeoStickersAndAlert';

interface NeoHomeViewProps {
  featuredTracks: Track[];
  playlists: Playlist[];
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isLiked: (trackId: string) => boolean;
  isYouTubeMode: boolean;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onPlayTrack: (track: Track, queue?: Track[]) => void;
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
  onOpenCreatePlaylist: () => void;
  onOpenQueue: () => void;
  onExportBackup: () => void;
  onOpenYouTubeModal: (track: Track) => void;
  onToggleSpectrum: () => void;
  onSelectPlaylist: (playlistId: string) => void;
  onAddToPlaylist?: (track: Track) => void;
  recentlyPlayedTracks?: Track[];
  onClearHistory?: () => void;
  onOpenFullPlayer?: () => void;
}

export const NeoHomeView: React.FC<NeoHomeViewProps> = ({
  featuredTracks,
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
  activeView,
  setActiveView,
  onPlayTrack,
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
  onOpenCreatePlaylist,
  onOpenQueue,
  onExportBackup,
  onOpenYouTubeModal,
  onToggleSpectrum,
  recentlyPlayedTracks = [],
  onClearHistory,
  onOpenFullPlayer
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Clean list of 30-minute nonstop tracks (orderly 6 to 10 tracks)
  const longPlayTracks = useMemo(() => {
    const fromFeatured = featuredTracks.filter(t => t.duration >= 1200);
    const defaults = DEFAULT_FEATURED_TRACKS.filter(t => t.duration >= 1200);
    const combined = [...fromFeatured, ...defaults];
    const seen = new Set<string>();
    const unique = combined.filter(t => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
    return unique.slice(0, 10);
  }, [featuredTracks]);

  // Scroll carousel left or right
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleFilterGenre = (genreQuery: string) => {
    setActiveView({ type: 'search', query: genreQuery });
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-32">
      
      {/* ============================================================== */}
      {/* 1. TOP QUICK MOOD / FILTER BADGES + ANNOUNCEMENT               */}
      {/* ============================================================== */}
      <section>
        <NeoStickersAndAlert
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenCreatePlaylist={onOpenCreatePlaylist}
          onFilterGenre={handleFilterGenre}
        />
      </section>

      {/* ============================================================== */}
      {/* 2. HERO ROW: LIVE PLAYER (Clean Full Width, No Playlist Card)  */}
      {/* ============================================================== */}
      <section className="w-full">
        <NeoMusicPlayerCard
          currentTrack={currentTrack || REFERENCE_TRACKS.midnightCity}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          isShuffle={isShuffle}
          repeatMode={repeatMode}
          isLiked={currentTrack ? isLiked(currentTrack.id) : false}
          isYouTubeMode={isYouTubeMode}
          onTogglePlay={onTogglePlay}
          onPrev={onPrev}
          onNext={onNext}
          onSeek={onSeek}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
          onToggleShuffle={onToggleShuffle}
          onCycleRepeat={onCycleRepeat}
          onToggleLike={onToggleLike}
          onToggleYouTubeMode={onToggleYouTubeMode}
          onOpenYouTubeModal={onOpenYouTubeModal}
          onToggleSpectrum={onToggleSpectrum}
          onOpenFullPlayer={onOpenFullPlayer}
        />
      </section>

      {/* ============================================================== */}
      {/* 3. 30-MIN NON-STOP SLIDE KE SAMPING (HORIZONTAL CAROUSEL)     */}
      {/* ============================================================== */}
      <section className="pt-2">
        {/* Section Header with Left/Right Navigation Controls */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="neo-sticker bg-[#FFE853] text-slate-950 text-xs py-1 px-3 rotate-[-1deg] font-black">
              ⏱️ 30 MENIT NON-STOP
            </span>
            <h3 className="text-sm sm:text-lg font-black uppercase text-slate-900 tracking-tight">
              Audio Panjang Tanpa Jeda &amp; Iklan
            </h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono font-bold text-slate-500 hidden sm:inline mr-1">
              Geser ke samping →
            </span>
            <button
              onClick={() => handleScroll('left')}
              title="Geser ke kiri"
              className="p-1.5 sm:p-2 bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 rounded-lg shadow-[1.5px_1.5px_0px_#18181b] active:scale-95 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              title="Geser ke kanan"
              className="p-1.5 sm:p-2 bg-[#FFE853] hover:bg-yellow-300 text-slate-950 border-2 border-slate-900 rounded-lg shadow-[1.5px_1.5px_0px_#18181b] active:scale-95 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Horizontal Slide Carousel with Snap Scroll */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {longPlayTracks.map(track => {
            const isCurrent = currentTrack?.id === track.id;
            const isTrackPlaying = isCurrent && isPlaying;

            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track, longPlayTracks)}
                className="shrink-0 w-[210px] sm:w-[250px] snap-start neo-card p-2 sm:p-3 bg-white flex flex-col justify-between cursor-pointer group hover:-translate-y-1 hover:shadow-[4px_4px_0px_#18181b] transition-all"
              >
                <div>
                  <div className="relative aspect-[16/10] sm:aspect-video rounded-lg sm:rounded-xl overflow-hidden border-2 border-slate-900 mb-2 sm:mb-2.5 bg-slate-900">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <span className="text-[8px] sm:text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-[#86E3CE] border border-slate-900 text-slate-950 shadow-[1px_1px_0px_#18181b]">
                        {Math.round(track.duration / 60)}M NON-STOP
                      </span>
                    </div>

                    {/* Overlay Play Icon */}
                    <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FFE853] border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#18181b] text-slate-950">
                        {isTrackPlaying ? <Pause size={15} className="fill-current" /> : <Play size={15} className="fill-current translate-x-0.5" />}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-[11px] sm:text-xs font-black uppercase text-slate-900 line-clamp-1 group-hover:text-[#2B50D9] transition-colors leading-tight">
                    {track.title}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[90px]">
                    {track.genre}
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isTrackPlaying) {
                        onTogglePlay();
                      } else {
                        onPlayTrack(track, longPlayTracks);
                      }
                    }}
                    className="p-1 rounded-full text-slate-500 hover:text-slate-950"
                  >
                    <Play size={13} className="fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. RECENTLY PLAYED SECTION (TERCATAT SECARA REAL TIME)          */}
      {/* ============================================================== */}
      <section className="pt-2">
        <NeoRecentlyPlayed
          tracks={recentlyPlayedTracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayTrack={onPlayTrack}
          onClearHistory={onClearHistory}
        />
      </section>

    </div>
  );
};
