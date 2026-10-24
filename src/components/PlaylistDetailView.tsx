import React from 'react';
import { Play, Shuffle, Edit3, Trash2, Music, Clock, Sparkles } from 'lucide-react';
import { Playlist, Track } from '../types/music';
import { TrackRow } from './TrackRow';
import { formatTime } from '../services/musicApi';

interface PlaylistDetailViewProps {
  playlist: Playlist;
  currentTrack: Track | null;
  isPlaying: boolean;
  isLiked: (trackId: string) => boolean;
  onPlayTrack: (track: Track, queue: Track[]) => void;
  onTogglePlay: () => void;
  onToggleLike: (track: Track) => void;
  onAddToPlaylist: (track: Track) => void;
  onRemoveTrack: (playlistId: string, trackId: string) => void;
  onEditPlaylist: (playlist: Playlist) => void;
  onDeletePlaylist: (id: string, name: string) => void;
  onOpenYouTube: (track: Track) => void;
  onGoToSearch: () => void;
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlist,
  currentTrack,
  isPlaying,
  isLiked,
  onPlayTrack,
  onTogglePlay,
  onToggleLike,
  onAddToPlaylist,
  onRemoveTrack,
  onEditPlaylist,
  onDeletePlaylist,
  onOpenYouTube,
  onGoToSearch
}) => {
  const totalSeconds = playlist.tracks.reduce((acc, t) => acc + (t.duration || 180), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      onPlayTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  const handleShuffleAll = () => {
    if (playlist.tracks.length > 0) {
      const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5);
      onPlayTrack(shuffled[0], shuffled);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-36 sm:pb-28">
      {/* Hero Header Card */}
      <div className="neo-card p-4 sm:p-6 md:p-8 bg-white border-2 border-slate-900 shadow-[4px_4px_0px_#18181b] relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 sm:gap-6 md:gap-8 relative z-10">
          {/* Cover Art Box with Neo-Brutalist Border */}
          <div className={`w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${playlist.coverGradient || 'from-[#FF7E67] to-[#FFE853]'} border-2 border-slate-900 shadow-[3px_3px_0px_#18181b] flex items-center justify-center shrink-0`}>
            <Music className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-slate-950" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="neo-sticker bg-[#86E3CE] text-slate-950 text-[10px] py-0.5 px-2 rotate-[-2deg]">
                PLAYLIST
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Koleksi Musik
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase text-slate-950 tracking-tight">
              {playlist.name}
            </h1>
            <p className="text-xs md:text-sm font-bold text-slate-600 max-w-xl">
              {playlist.description || 'Kumpulan lagu pilihan untuk menemani harimu.'}
            </p>

            <div className="pt-2 flex items-center justify-center md:justify-start gap-3 text-xs font-mono font-bold text-slate-500">
              <span>{playlist.tracks.length} Lagu</span>
              <span>•</span>
              <span>{totalMinutes} Menit Durasi</span>
              <span>•</span>
              <span className="text-slate-700 font-extrabold">Full Continuous Playback</span>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="relative z-10 mt-6 pt-5 border-t-2 border-slate-900 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayAll}
              disabled={playlist.tracks.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2B50D9] text-white font-black text-xs md:text-sm uppercase tracking-wider neo-btn disabled:opacity-50"
            >
              <Play size={16} className="fill-white" />
              <span>Putar Semua</span>
            </button>

            <button
              onClick={handleShuffleAll}
              disabled={playlist.tracks.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FFE853] text-slate-950 font-black text-xs md:text-sm uppercase tracking-wider neo-btn disabled:opacity-50"
            >
              <Shuffle size={16} />
              <span>Acak</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditPlaylist(playlist)}
              title="Edit Playlist"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs border border-slate-900 hover:bg-white transition-colors"
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </button>

            <button
              onClick={() => onDeletePlaylist(playlist.id, playlist.name)}
              title="Hapus Playlist"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 font-bold text-xs border border-red-300 hover:bg-red-100 transition-colors"
            >
              <Trash2 size={14} />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tracklist in Neo-Brutalist Card */}
      <div className="neo-card p-4 sm:p-6 bg-white">
        {playlist.tracks.length === 0 ? (
          <div className="py-14 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-slate-900 flex items-center justify-center mx-auto text-slate-700 shadow-[2px_2px_0px_#18181b]">
              <Music size={24} />
            </div>
            <h3 className="text-base font-black uppercase text-slate-900">
              Playlist Masih Kosong
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Cari lagu di katalog atau dashboard, lalu klik tombol "+ Playlist" untuk menambahkannya ke sini.
            </p>
            <button
              onClick={onGoToSearch}
              className="mt-3 px-5 py-2.5 rounded-full bg-[#FFE853] text-slate-950 font-black text-xs uppercase tracking-wider neo-btn"
            >
              Cari Lagu Baru
            </button>
          </div>
        ) : (
          <div className="divide-y-2 divide-slate-100">
            {playlist.tracks.map((track, idx) => (
              <TrackRow
                key={`${track.id}-${idx}`}
                index={idx}
                track={track}
                isCurrent={currentTrack?.id === track.id}
                isPlaying={isPlaying}
                isLiked={isLiked(track.id)}
                onPlay={(t) => onPlayTrack(t, playlist.tracks)}
                onTogglePlay={onTogglePlay}
                onToggleLike={onToggleLike}
                onAddToPlaylist={onAddToPlaylist}
                onRemoveFromPlaylist={(id) => onRemoveTrack(playlist.id, id)}
                onOpenYouTube={onOpenYouTube}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
