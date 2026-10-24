import React from 'react';
import { Play, Sparkles, Flame, Radio, Compass, Disc3 } from 'lucide-react';
import { Track, Playlist } from '../types/music';
import { GENRE_PRESETS } from '../data/defaultCatalog';
import { TrackCard } from './TrackCard';
import { TrackRow } from './TrackRow';

interface HomeViewProps {
  featuredTracks: Track[];
  playlists: Playlist[];
  currentTrack: Track | null;
  isPlaying: boolean;
  isLiked: (trackId: string) => boolean;
  onPlayTrack: (track: Track, queue?: Track[]) => void;
  onTogglePlay: () => void;
  onToggleLike: (track: Track) => void;
  onAddToPlaylist: (track: Track) => void;
  onSelectGenre: (genreQuery: string) => void;
  onSelectPlaylist: (playlistId: string) => void;
  onOpenYouTube: (track: Track) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  featuredTracks,
  playlists,
  currentTrack,
  isPlaying,
  isLiked,
  onPlayTrack,
  onTogglePlay,
  onToggleLike,
  onAddToPlaylist,
  onSelectGenre,
  onSelectPlaylist,
  onOpenYouTube
}) => {
  const heroTrack = featuredTracks[0] || null;

  return (
    <div className="space-y-8 pb-24">
      {/* Hero Aurora Banner */}
      {heroTrack && (
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 md:p-8">
          {/* Dynamic glowing background */}
          <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full blur-[100px] opacity-40 bg-gradient-to-br from-emerald-500 via-teal-500 to-violet-600" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Sparkles size={13} />
                <span>30-Min Non-Stop & Full Hits — Tanpa Potongan 30 Detik</span>
              </div>

              <h1 className="text-2xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {heroTrack.title}
              </h1>

              <p className="text-sm md:text-base text-slate-300 font-medium">
                {heroTrack.artist} — {heroTrack.album}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-400">
                <span>{heroTrack.genre}</span>
                <span aria-hidden="true">·</span>
                <span>{heroTrack.releaseDate?.split('-')[0] || '2024'}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-medium">
                  {heroTrack.duration >= 1200 ? '⏱️ 30 Menit Penuh Non-Stop' : '🎵 Full Audio 100%'}
                </span>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => onPlayTrack(heroTrack, featuredTracks)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/30 active:scale-95 transition-all"
                >
                  <Play size={18} className="fill-slate-950" />
                  <span>Putar Full Non-Stop</span>
                </button>

                <button
                  onClick={() => onOpenYouTube(heroTrack)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/10 transition-colors"
                >
                  <Radio size={15} className="text-rose-400" />
                  <span>Buka Video YouTube</span>
                </button>
              </div>
            </div>

            {/* Hero Artwork with Glass Depth */}
            <div className="relative group shrink-0">
              <div className="w-48 h-48 md:w-60 md:h-60 rounded-2xl overflow-hidden bg-slate-900 border border-white/20 shadow-2xl relative">
                <img
                  src={heroTrack.coverUrl}
                  alt={heroTrack.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Genre Filter Buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Compass size={15} className="text-emerald-400" />
            <span>Kategori & Genre Musik</span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {GENRE_PRESETS.map((genre) => (
            <button
              key={genre.id}
              onClick={() => onSelectGenre(genre.query)}
              className="px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40 border border-white/10 transition-all active:scale-95"
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Curated Playlists Showcase */}
      {playlists.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Disc3 size={15} className="text-emerald-400" />
              <span>Playlist Pilihan Untukmu</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.slice(0, 3).map((pl) => (
              <div
                key={pl.id}
                onClick={() => onSelectPlaylist(pl.id)}
                className="group relative glass-panel hover:glass-panel-elevated rounded-2xl p-4 border border-white/10 cursor-pointer transition-all flex items-center gap-4"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${pl.coverGradient} flex items-center justify-center shrink-0 border border-white/20 shadow-md group-hover:scale-105 transition-transform`}>
                  <Sparkles size={22} className="text-white/80" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors truncate">
                    {pl.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {pl.description}
                  </p>
                  <span className="text-[11px] text-slate-500 mt-1 inline-block">
                    {pl.tracks.length} lagu tersimpan
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dedicated 30-Minute Non-Stop Continuous Mixes */}
      {featuredTracks.some(t => t.duration >= 1200) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Sparkles size={15} className="text-emerald-400 animate-pulse" />
              <span>Sesi 30 Menit Non-Stop (Fokus, Santai & Belajar — Tanpa Jeda / Iklan)</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Full Sesi Panjang
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTracks.filter(t => t.duration >= 1200).map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                isCurrent={currentTrack?.id === track.id}
                isPlaying={isPlaying}
                isLiked={isLiked(track.id)}
                onPlay={(t) => onPlayTrack(t, featuredTracks)}
                onTogglePlay={onTogglePlay}
                onToggleLike={onToggleLike}
                onAddToPlaylist={onAddToPlaylist}
                onOpenYouTube={onOpenYouTube}
              />
            ))}
          </div>
        </div>
      )}

      {/* Popular Tracks Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Flame size={15} className="text-emerald-400" />
            <span>Koleksi Lagu Populer & Tren Lengkap (Full Track)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              isCurrent={currentTrack?.id === track.id}
              isPlaying={isPlaying}
              isLiked={isLiked(track.id)}
              onPlay={(t) => onPlayTrack(t, featuredTracks)}
              onTogglePlay={onTogglePlay}
              onToggleLike={onToggleLike}
              onAddToPlaylist={onAddToPlaylist}
              onOpenYouTube={onOpenYouTube}
            />
          ))}
        </div>
      </div>

      {/* Top Hits List View */}
      <div className="space-y-3 glass-panel rounded-2xl p-4 md:p-6 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white">Daftar Putar Cepat</h3>
          <span className="text-xs text-slate-400">{featuredTracks.length} lagu</span>
        </div>

        <div className="space-y-1">
          {featuredTracks.slice(0, 6).map((track, idx) => (
            <TrackRow
              key={`row-${track.id}`}
              index={idx}
              track={track}
              isCurrent={currentTrack?.id === track.id}
              isPlaying={isPlaying}
              isLiked={isLiked(track.id)}
              onPlay={(t) => onPlayTrack(t, featuredTracks)}
              onTogglePlay={onTogglePlay}
              onToggleLike={onToggleLike}
              onAddToPlaylist={onAddToPlaylist}
              onOpenYouTube={onOpenYouTube}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
