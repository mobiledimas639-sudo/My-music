import React from 'react';
import { Play, Pause, Star } from 'lucide-react';
import { Track } from '../types/music';

interface NeoRecentlyPlayedProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track, queue?: Track[]) => void;
}

export const NeoRecentlyPlayed: React.FC<NeoRecentlyPlayedProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack
}) => {
  // Preset star ratings
  const ratings = [4.9, 4.8, 5.0, 4.7];

  return (
    <div className="flex flex-col h-full">
      {/* Clean Header Indicator */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono flex items-center gap-1.5">
          <span>🕒</span> BARU SAJA DIPUTAR
        </span>
        <span className="neo-sticker bg-[#FFE853] text-slate-900 text-[10px] py-0.5 px-2 rotate-[-2deg]">
          RECENT
        </span>
      </div>

      {/* Main Neo Card */}
      <div className="neo-card flex-1 flex flex-col justify-between p-4 sm:p-5 bg-white">
        {/* Tracklist items */}
        <div className="space-y-2">
          {tracks.slice(0, 4).map((track, i) => {
            const isCurrent = currentTrack?.id === track.id;
            const isTrackPlaying = isCurrent && isPlaying;
            const starRating = ratings[i] || 4.8;

            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track, tracks)}
                className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer border-2 transition-all ${
                  isCurrent
                    ? 'bg-[#FFE853]/40 border-slate-900 shadow-[2px_2px_0px_#18181b]'
                    : 'bg-white border-slate-200 hover:border-slate-900 hover:shadow-[2px_2px_0px_#18181b]'
                }`}
              >
                {/* Circular Play Button + Song Title & Artist */}
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayTrack(track, tracks);
                    }}
                    aria-label={`Putar ${track.title}`}
                    className={`w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center shrink-0 transition-transform ${
                      isCurrent 
                        ? 'bg-[#2B50D9] text-white shadow-[1px_1px_0px_#18181b]' 
                        : 'bg-white text-slate-900 hover:scale-105 shadow-[1px_1px_0px_#18181b]'
                    }`}
                  >
                    {isTrackPlaying ? (
                      <Pause size={13} className="fill-current" />
                    ) : (
                      <Play size={13} className="fill-current translate-x-0.5" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {track.title}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-500 truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>

                {/* Rating & Duration */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 font-mono">
                    <Star size={12} className="fill-amber-400 text-amber-500" />
                    <span>{starRating}</span>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-700 tabular-nums">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean footer info */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
          <span>Audio Kualitas Tinggi (320kbps)</span>
          <span className="text-[#2B50D9]">Tersimpan Otomatis</span>
        </div>
      </div>
    </div>
  );
};
