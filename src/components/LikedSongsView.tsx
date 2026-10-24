import React, { useState } from 'react';
import { Play, Shuffle, Heart, Search, Music, Clock } from 'lucide-react';
import { Track } from '../types/music';
import { TrackRow } from './TrackRow';

interface LikedSongsViewProps {
  likedTracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  isLiked: (trackId: string) => boolean;
  onPlayTrack: (track: Track, queue?: Track[]) => void;
  onTogglePlay: () => void;
  onToggleLike: (track: Track) => void;
  onAddToPlaylist: (track: Track) => void;
  onOpenYouTube: (track: Track) => void;
  onGoToSearch: () => void;
}

export const LikedSongsView: React.FC<LikedSongsViewProps> = ({
  likedTracks,
  currentTrack,
  isPlaying,
  isLiked,
  onPlayTrack,
  onTogglePlay,
  onToggleLike,
  onAddToPlaylist,
  onOpenYouTube,
  onGoToSearch
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = likedTracks.filter(t => 
    t.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    t.artist.toLowerCase().includes(filterQuery.toLowerCase()) ||
    t.album.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const totalSeconds = likedTracks.reduce((acc, t) => acc + (t.duration || 180), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  const handlePlayAll = () => {
    if (likedTracks.length > 0) {
      onPlayTrack(likedTracks[0], likedTracks);
    }
  };

  const handleShuffleAll = () => {
    if (likedTracks.length > 0) {
      const shuffled = [...likedTracks].sort(() => Math.random() - 0.5);
      onPlayTrack(shuffled[0], shuffled);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-36 sm:pb-28">
      {/* Hero Header in Neo-Brutalist Style */}
      <div className="neo-card p-4 sm:p-6 md:p-8 bg-gradient-to-r from-[#FF7E67] via-[#FF6F59] to-[#FFA17A] text-slate-950 relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 sm:gap-6 md:gap-8 relative z-10">
          {/* Heart Icon Block */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl sm:rounded-3xl bg-white border-2 border-slate-900 shadow-[3px_3px_0px_#18181b] flex items-center justify-center shrink-0">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[#FF6F59] fill-[#FF6F59]" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="neo-sticker bg-[#18181B] text-white text-[10px] py-0.5 px-2 rotate-[-2deg]">
                FAVORITES
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Koleksi Lagu Disukai
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase text-slate-950 tracking-tight">
              LAGU YANG DISUKAI
            </h1>
            <p className="text-xs md:text-sm font-bold text-slate-900/90 max-w-xl">
              Semua trek favoritmu tersimpan aman dan siap diputar kapan saja tanpa jeda.
            </p>

            <div className="pt-2 flex items-center justify-center md:justify-start gap-3 text-xs font-mono font-bold text-slate-900">
              <span>{likedTracks.length} Lagu</span>
              <span>•</span>
              <span>{totalMinutes} Menit</span>
              <span>•</span>
              <span className="bg-white/80 px-2 py-0.5 rounded border border-slate-900">Browser Storage</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="relative z-10 mt-6 pt-5 border-t-2 border-slate-900 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayAll}
              disabled={likedTracks.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-950 font-black text-xs md:text-sm uppercase tracking-wider neo-btn disabled:opacity-50"
            >
              <Play size={16} className="fill-slate-950" />
              <span>Putar Semua</span>
            </button>

            <button
              onClick={handleShuffleAll}
              disabled={likedTracks.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FFE853] text-slate-950 font-black text-xs md:text-sm uppercase tracking-wider neo-btn disabled:opacity-50"
            >
              <Shuffle size={16} />
              <span>Acak</span>
            </button>
          </div>

          {likedTracks.length > 0 && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Cari lagu favorit..."
                className="w-full pl-10 pr-3 py-2 text-xs font-bold bg-white text-slate-900 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Song List in Neo-Brutalist Card */}
      <div className="neo-card p-4 sm:p-6 bg-white">
        {likedTracks.length === 0 ? (
          <div className="py-14 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#FFE853] border-2 border-slate-900 shadow-[3px_3px_0px_#18181b] flex items-center justify-center mx-auto text-slate-900">
              <Heart size={24} className="fill-[#FF6F59] text-slate-900" />
            </div>
            <h3 className="text-base font-black uppercase text-slate-900">
              Belum Ada Lagu Yang Disukai
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Klik ikon hati pada lagu manapun di dashboard atau hasil pencarian untuk menyimpannya ke koleksi favoritmu!
            </p>
            <button
              onClick={onGoToSearch}
              className="mt-3 px-5 py-2.5 rounded-full bg-[#2B50D9] text-white font-black text-xs uppercase tracking-wider neo-btn"
            >
              Jelajahi Lagu
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-xs font-bold text-slate-500 font-mono">
            Tidak ditemukan lagu yang cocok dengan "{filterQuery}".
          </div>
        ) : (
          <div className="divide-y-2 divide-slate-100">
            {filtered.map((track, idx) => (
              <TrackRow
                key={track.id}
                index={idx}
                track={track}
                isCurrent={currentTrack?.id === track.id}
                isPlaying={isPlaying}
                isLiked={isLiked(track.id)}
                onPlay={(t) => onPlayTrack(t, filtered)}
                onTogglePlay={onTogglePlay}
                onToggleLike={onToggleLike}
                onAddToPlaylist={onAddToPlaylist}
                onOpenYouTube={onOpenYouTube}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
