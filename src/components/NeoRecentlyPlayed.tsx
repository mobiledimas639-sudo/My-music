import React from 'react';
import { Play, Pause, History, Trash2, Clock } from 'lucide-react';
import { Track } from '../types/music';
import { formatTime } from '../services/musicApi';

interface NeoRecentlyPlayedProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track, queue?: Track[]) => void;
  onClearHistory?: () => void;
}

export const NeoRecentlyPlayed: React.FC<NeoRecentlyPlayedProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onClearHistory
}) => {
  const displayTracks = tracks.slice(0, 6);

  return (
    <div className="flex flex-col h-full">
      {/* Clean Header Indicator */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono flex items-center gap-1.5">
          <History size={15} className="text-[#2B50D9]" />
          <span>BARU SAJA DIPUTAR</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="neo-sticker bg-[#86E3CE] text-slate-950 text-[10px] py-0.5 px-2 rotate-[-2deg] font-mono font-black">
            REAL-TIME
          </span>
          {onClearHistory && tracks.length > 0 && (
            <button
              onClick={onClearHistory}
              title="Bersihkan riwayat pemutaran"
              className="text-[10px] font-mono font-bold text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <Trash2 size={12} />
              <span>Hapus</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Neo Card */}
      <div className="neo-card flex-1 flex flex-col justify-between p-4 sm:p-5 bg-white">
        {displayTracks.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <Clock className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-600">
              Belum ada riwayat pemutaran.
            </p>
            <p className="text-[11px] font-mono text-slate-400">
              Putar lagu apa saja untuk mencatat riwayat secara real-time.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayTracks.map((track) => {
              const isCurrent = currentTrack?.id === track.id;
              const isTrackPlaying = isCurrent && isPlaying;

              return (
                <div
                  key={track.id}
                  onClick={() => onPlayTrack(track, tracks)}
                  className={`flex items-center justify-between p-2 sm:p-2.5 rounded-xl cursor-pointer border-2 transition-all ${
                    isCurrent
                      ? 'bg-[#FFE853]/40 border-slate-900 shadow-[2px_2px_0px_#18181b]'
                      : 'bg-white border-slate-200 hover:border-slate-900 hover:shadow-[2px_2px_0px_#18181b]'
                  }`}
                >
                  {/* Thumbnail + Play Button + Song Title & Artist */}
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayTrack(track, tracks);
                      }}
                      aria-label={`Putar ${track.title}`}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-slate-900 flex items-center justify-center shrink-0 transition-transform ${
                        isCurrent 
                          ? 'bg-[#2B50D9] text-white shadow-[1px_1px_0px_#18181b]' 
                          : 'bg-[#FFE853] text-slate-950 hover:scale-105 shadow-[1px_1px_0px_#18181b]'
                      }`}
                    >
                      {isTrackPlaying ? (
                        <Pause size={13} className="fill-current" />
                      ) : (
                        <Play size={13} className="fill-current translate-x-0.5" />
                      )}
                    </button>

                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-slate-900 shrink-0 bg-slate-900">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {track.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  {/* Duration & Tag */}
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      {formatTime(track.duration)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Clean footer info */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 font-mono">
          <span>{tracks.length} lagu dalam riwayat</span>
          <span className="text-[#2B50D9]">Tercatat Real-Time</span>
        </div>
      </div>
    </div>
  );
};
