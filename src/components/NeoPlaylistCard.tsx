import React from 'react';
import { Play, Pause, Music, Heart, Plus, Sparkles } from 'lucide-react';
import { Track, Playlist } from '../types/music';

interface NeoPlaylistCardProps {
  playlist: Playlist;
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track, queue?: Track[]) => void;
  onPlayPlaylist: (playlist: Playlist) => void;
  onOpenPlaylistDetail?: (playlistId: string) => void;
}

export const NeoPlaylistCard: React.FC<NeoPlaylistCardProps> = ({
  playlist,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPlayPlaylist,
  onOpenPlaylistDetail
}) => {
  const isPlaylistActive = playlist.tracks.some(t => t.id === currentTrack?.id);

  return (
    <div className="flex flex-col h-full">
      {/* Clean Header Indicator */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono flex items-center gap-1.5">
          <span>🔥</span> PLAYLIST PILIHAN
        </span>
        <span className="neo-sticker bg-[#86E3CE] text-slate-900 text-[10px] py-0.5 px-2 rotate-[2deg]">
          CURATED
        </span>
      </div>

      {/* Main Neo Card */}
      <div className="neo-card flex-1 flex flex-col overflow-hidden bg-white">
        
        {/* Coral/Salmon Gradient Header Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#FF7E67] via-[#FF6F59] to-[#FFA17A] border-b-2 border-slate-900 flex items-center justify-between relative overflow-hidden">
          {/* Subtle background circle deco */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/20 pointer-events-none" />

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900/80 font-mono">
              DAFTAR PUTAR POPULER
            </span>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-950 mt-0.5">
              {playlist.name.toUpperCase()}
            </h3>
            <p className="text-xs font-bold text-slate-900/80 mt-0.5">
              {playlist.tracks.length} Lagu • Non-Stop Hits
            </p>
          </div>

          {/* White Circular Play Button with Drop Shadow */}
          <button
            onClick={() => onPlayPlaylist(playlist)}
            title="Putar Seluruh Playlist"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-slate-950 border-2 border-slate-900 shadow-[3px_3px_0px_#18181b] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shrink-0 z-10"
          >
            {isPlaylistActive && isPlaying ? (
              <Pause size={18} className="fill-slate-950" />
            ) : (
              <Play size={18} className="fill-slate-950 translate-x-0.5" />
            )}
          </button>
        </div>

        {/* Tracklist Rows */}
        <div className="divide-y-2 divide-slate-100 flex-1 flex flex-col justify-between p-2">
          {playlist.tracks.slice(0, 4).map((track, index) => {
            const isCurrent = currentTrack?.id === track.id;
            const isTrackPlaying = isCurrent && isPlaying;

            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track, playlist.tracks)}
                className={`group flex items-center justify-between p-2 sm:p-2.5 rounded-xl cursor-pointer transition-all ${
                  isCurrent 
                    ? 'bg-[#FFE853]/40 border-2 border-slate-900 shadow-[2px_2px_0px_#18181b]' 
                    : 'hover:bg-amber-50/80'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Circular Play / Status Indicator */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayTrack(track, playlist.tracks);
                    }}
                    className={`w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center shrink-0 transition-transform ${
                      isCurrent 
                        ? 'bg-[#2B50D9] text-white shadow-[1px_1px_0px_#18181b]' 
                        : 'bg-white text-slate-900 group-hover:scale-110 shadow-[1px_1px_0px_#18181b]'
                    }`}
                  >
                    {isTrackPlaying ? (
                      <Pause size={11} className="fill-current" />
                    ) : (
                      <Play size={11} className="fill-current translate-x-0.5" />
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

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Link to View Playlist Details */}
        <div className="p-2.5 bg-slate-50 border-t-2 border-slate-900 flex items-center justify-between">
          <button
            onClick={() => onOpenPlaylistDetail?.(playlist.id)}
            className="w-full text-center py-1.5 text-xs font-black uppercase tracking-wider text-slate-900 hover:text-[#2B50D9] transition-colors"
          >
            Lihat Detail Playlist &amp; Semua Lagu →
          </button>
        </div>

      </div>
    </div>
  );
};
