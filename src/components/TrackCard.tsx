import React from 'react';
import { Play, Pause, Heart, Plus, Youtube, Sparkles } from 'lucide-react';
import { Track } from '../types/music';
import { formatTime } from '../services/musicApi';

interface TrackCardProps {
  track: Track;
  isPlaying?: boolean;
  isCurrent?: boolean;
  isCurrentTrack?: boolean;
  isLiked: boolean;
  onPlay: (track: Track) => void;
  onTogglePlay?: () => void;
  onToggleLike: (track: Track) => void;
  onAddToPlaylist: (track: Track) => void;
  onOpenYouTube: (track: Track) => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  isPlaying = false,
  isCurrent,
  isCurrentTrack,
  isLiked,
  onPlay,
  onTogglePlay,
  onToggleLike,
  onAddToPlaylist,
  onOpenYouTube
}) => {
  const activeCurrent = isCurrentTrack ?? isCurrent ?? false;
  const isPlayingThis = activeCurrent && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeCurrent && onTogglePlay) {
      onTogglePlay();
    } else {
      onPlay(track);
    }
  };

  return (
    <div 
      onClick={() => onPlay(track)}
      className={`group relative neo-card-interactive p-2.5 sm:p-3.5 bg-white flex flex-col justify-between cursor-pointer ${
        activeCurrent ? 'ring-2 ring-[#2B50D9] bg-amber-50/60 shadow-[4px_4px_0px_#18181b]' : ''
      }`}
    >
      {/* Artwork Container with Neo-Brutalist Border */}
      <div className="relative aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden bg-slate-900 mb-2 sm:mb-3 border-2 border-slate-900 shadow-[2px_2px_0px_#18181b]">
        <img
          src={track.coverUrl}
          alt={track.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* 30-Min Non-Stop Badge */}
        {track.duration >= 1200 && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10">
            <span className="neo-sticker bg-[#86E3CE] text-slate-950 text-[8px] sm:text-[9px] py-0.5 px-1 sm:px-1.5 rotate-[-3deg]">
              30M NON-STOP
            </span>
          </div>
        )}

        {/* Action Controls on Hover */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={handlePlayClick}
            aria-label={isPlayingThis ? 'Jeda' : 'Putar'}
            className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#FFE853] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            {isPlayingThis ? (
              <Pause size={16} className="fill-slate-950" />
            ) : (
              <Play size={16} className="fill-slate-950 translate-x-0.5" />
            )}
          </button>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(track);
          }}
          title={isLiked ? 'Hapus Like' : 'Sukai Lagu'}
          className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1 sm:p-1.5 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_#18181b] transition-all ${
            isLiked 
              ? 'bg-[#FF6F59] text-white opacity-100' 
              : 'bg-white text-slate-700 opacity-0 group-hover:opacity-100 hover:scale-105'
          }`}
        >
          <Heart size={12} className={isLiked ? 'fill-white' : ''} />
        </button>
      </div>

      {/* Track Info */}
      <div className="space-y-0.5 sm:space-y-1">
        <h4 className="text-[11px] sm:text-sm font-black uppercase text-slate-900 truncate tracking-tight group-hover:text-[#2B50D9] transition-colors leading-tight">
          {track.title}
        </h4>
        <p className="text-[10px] sm:text-xs font-bold text-slate-600 truncate">
          {track.artist}
        </p>

        <div className="pt-1.5 sm:pt-2 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 border-t border-slate-100">
          <span className="truncate max-w-[65px] sm:max-w-none">{track.genre || 'Music'}</span>
          <span className="font-bold text-slate-700 tabular-nums shrink-0">
            {formatTime(track.duration)}
          </span>
        </div>
      </div>

      {/* Quick Add / YouTube action row */}
      <div className="mt-2.5 pt-2 border-t-2 border-slate-100 flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToPlaylist(track);
          }}
          className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-950 transition-colors"
        >
          <Plus size={13} className="stroke-[2.5]" />
          <span>Playlist</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenYouTube(track);
          }}
          title="Tonton di YouTube"
          className="p-1 text-slate-500 hover:text-red-600 transition-colors"
        >
          <Youtube size={14} />
        </button>
      </div>
    </div>
  );
};
