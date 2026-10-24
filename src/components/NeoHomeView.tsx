import React from 'react';
import { Sparkles, Radio, Flame, Clock, Heart, Play, Pause, ChevronRight } from 'lucide-react';
import { Track, Playlist, ActiveView, RepeatMode } from '../types/music';
import { REFERENCE_TRACKS } from '../data/defaultCatalog';
import { NeoPlaylistCard } from './NeoPlaylistCard';
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
}

export const NeoHomeView: React.FC<NeoHomeViewProps> = ({
  featuredTracks,
  playlists,
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
  onSelectPlaylist
}) => {
  const summerPlaylist = playlists.find(p => p.id === 'playlist-summer-vibes') || playlists[0];
  
  // Clean list of 30-minute nonstop tracks
  const longPlayTracks = featuredTracks.filter(t => t.duration >= 1200);

  // Clean list of popular single tracks
  const popularTracks = [
    REFERENCE_TRACKS.midnightCity,
    REFERENCE_TRACKS.euphoria,
    REFERENCE_TRACKS.starfall,
    REFERENCE_TRACKS.solarFlare
  ];

  // Recently played tracks list
  const recentlyPlayedList = [
    REFERENCE_TRACKS.starfall,
    REFERENCE_TRACKS.echoes,
    REFERENCE_TRACKS.velvetSky,
    REFERENCE_TRACKS.driftAway
  ];

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
      {/* 2. HERO ROW: LIVE PLAYER (Left) + FEATURED PLAYLIST (Right)   */}
      {/* ============================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Main Live Player: Takes 2 Columns on Desktop */}
        <div className="lg:col-span-2">
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
          />
        </div>

        {/* Featured Playlist: Takes 1 Column on Desktop */}
        {summerPlaylist && (
          <div className="lg:col-span-1">
            <NeoPlaylistCard
              playlist={summerPlaylist}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={onPlayTrack}
              onPlayPlaylist={(p) => {
                if (p.tracks.length > 0) {
                  onPlayTrack(p.tracks[0], p.tracks);
                }
              }}
              onOpenPlaylistDetail={onSelectPlaylist}
            />
          </div>
        )}

      </section>

      {/* ============================================================== */}
      {/* 3. 30-MIN NON-STOP CONTINUOUS MIXES SECTION (FULL AUDIO)       */}
      {/* ============================================================== */}
      <section className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-[#FFE853] text-slate-950 text-xs py-1 px-3 rotate-[-1deg] font-black">
              ⏱️ 30 MENIT NON-STOP
            </span>
            <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">
              Audio Panjang Tanpa Jeda &amp; Iklan
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            100% Full Uninterrupted • Bebas Gangguan
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {longPlayTracks.map(track => {
            const isCurrent = currentTrack?.id === track.id;
            const isTrackPlaying = isCurrent && isPlaying;

            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track, featuredTracks)}
                className="neo-card p-2 sm:p-3.5 bg-white flex flex-col justify-between cursor-pointer group hover:-translate-y-1 hover:shadow-[4px_4px_0px_#18181b] transition-all"
              >
                <div>
                  <div className="relative aspect-[16/10] sm:aspect-video rounded-lg sm:rounded-xl overflow-hidden border-2 border-slate-900 mb-2 sm:mb-3 bg-slate-900">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                      <span className="text-[8px] sm:text-[10px] font-mono font-black px-1.5 sm:px-2 py-0.5 rounded bg-[#86E3CE] border border-slate-900 text-slate-950 shadow-[1px_1px_0px_#18181b]">
                        {Math.round(track.duration / 60)}M
                      </span>
                    </div>

                    {/* Overlay Play Icon on Hover */}
                    <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FFE853] border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#18181b] text-slate-950">
                        {isTrackPlaying ? <Pause size={15} className="fill-current" /> : <Play size={15} className="fill-current translate-x-0.5" />}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-[11px] sm:text-sm font-black uppercase text-slate-900 line-clamp-1 group-hover:text-[#2B50D9] transition-colors leading-tight">
                    {track.title}
                  </h4>
                  <p className="text-[9px] sm:text-[11px] font-bold text-slate-500 truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>

                <div className="mt-2 sm:mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded truncate max-w-[80px] sm:max-w-none">
                    {track.genre}
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isTrackPlaying) {
                        onTogglePlay();
                      } else {
                        onPlayTrack(track, featuredTracks);
                      }
                    }}
                    aria-label={`Putar ${track.title}`}
                    className={`p-1.5 sm:p-2 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_#18181b] group-hover:scale-110 transition-transform ${
                      isTrackPlaying ? 'bg-[#86E3CE] text-slate-950' : 'bg-[#2B50D9] text-white'
                    }`}
                  >
                    {isTrackPlaying ? <Pause size={11} className="fill-current" /> : <Play size={11} className="fill-current translate-x-0.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. BALANCED LOWER ROW: TRENDING HITS (Left) + RECENT (Right)   */}
      {/* ============================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: TOP TRENDING & POPULAR SINGLES */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono flex items-center gap-1.5">
              <span>🔥</span> LAGU POPULER &amp; TRENDING
            </span>
            <span className="neo-sticker bg-[#FF7E67] text-white text-[10px] py-0.5 px-2 rotate-[1deg]">
              TOP CHARTS
            </span>
          </div>

          <div className="neo-card flex-1 flex flex-col justify-between p-4 sm:p-5 bg-white">
            <div className="space-y-2">
              {popularTracks.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id;
                const isTrackPlaying = isCurrent && isPlaying;
                const liked = isLiked(track.id);

                return (
                  <div
                    key={track.id}
                    onClick={() => onPlayTrack(track, featuredTracks)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer border-2 transition-all ${
                      isCurrent
                        ? 'bg-[#FFE853]/40 border-slate-900 shadow-[2px_2px_0px_#18181b]'
                        : 'bg-white border-slate-200 hover:border-slate-900 hover:shadow-[2px_2px_0px_#18181b]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank Number */}
                      <span className="w-5 text-center font-mono font-black text-sm text-slate-400">
                        0{idx + 1}
                      </span>

                      {/* Small Cover Art */}
                      <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-900 shrink-0 bg-slate-900">
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                          {track.title}
                        </h4>
                        <p className="text-[11px] font-medium text-slate-500 truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      {/* Like button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLike(track);
                        }}
                        aria-label="Sukai Lagu"
                        className={`p-1.5 rounded-lg transition-colors ${
                          liked ? 'text-red-500' : 'text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <Heart size={14} className={liked ? 'fill-red-500' : ''} />
                      </button>

                      {/* Play button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isTrackPlaying) {
                            onTogglePlay();
                          } else {
                            onPlayTrack(track, featuredTracks);
                          }
                        }}
                        className={`w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center transition-transform ${
                          isCurrent
                            ? 'bg-[#2B50D9] text-white shadow-[1px_1px_0px_#18181b]'
                            : 'bg-white text-slate-900 hover:scale-105 shadow-[1px_1px_0px_#18181b]'
                        }`}
                      >
                        {isTrackPlaying ? (
                          <Pause size={12} className="fill-current" />
                        ) : (
                          <Play size={12} className="fill-current translate-x-0.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Explore Link */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Top 50 Indonesia &amp; Global</span>
              <button
                onClick={() => setActiveView({ type: 'search', query: 'pop' })}
                className="text-[#2B50D9] hover:underline flex items-center gap-0.5"
              >
                Jelajahi Lebih Banyak <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: RECENTLY PLAYED SECTION */}
        <div className="flex flex-col h-full">
          <NeoRecentlyPlayed
            tracks={recentlyPlayedList}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={onPlayTrack}
          />
        </div>

      </section>

    </div>
  );
};
