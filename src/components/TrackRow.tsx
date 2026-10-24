import React from 'react';
import { Play, Pause, Heart, Plus, Trash2, Youtube } from 'lucide-react';
import { Track } from '../types/music';
import { formatTime } from '../services/musicApi';

interface TrackRowProps {
  index: number;
  track: Track;
  isCurrent?: boolean;
  isCurrentTrack?: boolean;
  isPlaying?: boolean;
  isLiked: boolean;
  onPlay: (track: Track) => void;
  onTogglePlay?: () => void;
  onToggleLike: (track: Track) => void;
  onAddToPlaylist: (track: Track) => void;
  onRemoveFromPlaylist?: (trackId: string) => void;
  onOpenYouTube: (track: Track) => void;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  index,
  track,
  isCurrent,
  isCurrentTrack,
  isPlaying = false,
  isLiked,
  onPlay,
  onTogglePlay,
  onToggleLike,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  onOpenYouTube
}) => {
  const activeCurrent = isCurrentTrack ?? isCurrent ?? false;
  const isPlayingThis = activeCurrent && isPlaying;

  const handleRowClick = () => {
    if (activeCurrent && onTogglePlay) {
      onTogglePlay();
    } else {
      onPlay(track);
    }
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group grid grid-cols-[36px_1fr_auto] md:grid-cols-[40px_minmax(180px,2fr)_minmax(120px,1.5fr)_80px_110px] items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-xs ${
        activeCurrent
          ? 'bg-[#FFE853]/50 border-2 border-slate-900 shadow-[2px_2px_0px_#18181b]'
          : 'hover:bg-amber-50/80 border-2 border-transparent hover:border-slate-300'
      }`}
    >
      {/* Col 1: Play / Index */}
      <div className="flex items-center justify-center font-mono font-bold tabular-nums text-slate-500">
        {isPlayingThis ? (
          <div className="flex items-end gap-0.5 h-3.5">
            <span className="w-1 bg-[#2B50D9] animate-neo-eq-1 rounded-full" />
            <span className="w-1 bg-[#FF7E67] animate-neo-eq-2 rounded-full" />
            <span className="w-1 bg-[#86E3CE] animate-neo-eq-3 rounded-full" />
          </div>
        ) : (
          <>
            <span className="group-hover:hidden">{index + 1}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(track);
              }}
              className="hidden group-hover:flex w-6 h-6 rounded-full bg-[#2B50D9] text-white items-center justify-center border border-slate-900"
            >
              <Play size={10} className="fill-white translate-x-0.5" />
            </button>
          </>
        )}
      </div>

      {/* Col 2: Cover & Title/Artist */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={track.coverUrl}
          alt={track.title}
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-lg object-cover bg-slate-900 border-2 border-slate-900 shrink-0 shadow-[1px_1px_0px_#18181b]"
        />
        <div className="truncate">
          <div className="flex items-center gap-1.5 truncate">
            <span className={`font-black uppercase tracking-tight truncate ${activeCurrent ? 'text-slate-950 font-black' : 'text-slate-900'}`}>
              {track.title}
            </span>
            {track.duration >= 1200 && (
              <span className="text-[9px] font-mono font-black px-1.5 rounded bg-[#86E3CE] text-slate-950 border border-slate-900 shrink-0">
                30M
              </span>
            )}
          </div>
          <div className="text-[11px] font-bold text-slate-500 truncate">
            {track.artist}
          </div>
        </div>
      </div>

      {/* Col 3: Album (Hidden on mobile) */}
      <div className="hidden md:block truncate text-slate-600 font-medium">
        {track.album || 'Single'}
      </div>

      {/* Col 4: Duration */}
      <div className="hidden md:block font-mono font-bold tabular-nums text-slate-700 text-right">
        {formatTime(track.duration)}
      </div>

      {/* Col 5: Actions */}
      <div className="flex items-center justify-end gap-1.5 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenYouTube(track);
          }}
          title="Tonton di YouTube"
          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Youtube size={15} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(track);
          }}
          title={isLiked ? 'Hapus Like' : 'Sukai Lagu'}
          className={`p-1.5 rounded-lg border transition-colors ${
            isLiked
              ? 'bg-[#FF6F59] text-white border-slate-900'
              : 'text-slate-500 hover:text-slate-900 border-transparent hover:border-slate-300'
          }`}
        >
          <Heart size={14} className={isLiked ? 'fill-white' : ''} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToPlaylist(track);
          }}
          title="Tambah ke Playlist"
          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Plus size={15} className="stroke-[2.5]" />
        </button>

        {onRemoveFromPlaylist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFromPlaylist(track.id);
            }}
            title="Hapus dari Playlist"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
};
