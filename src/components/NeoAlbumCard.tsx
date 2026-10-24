import React from 'react';
import { Play, Pause, Shuffle, Repeat, Heart, Disc3 } from 'lucide-react';
import { Track } from '../types/music';

interface NeoAlbumCardProps {
  track: Track;
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onTogglePlay: () => void;
}

export const NeoAlbumCard: React.FC<NeoAlbumCardProps> = ({
  track,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onTogglePlay
}) => {
  const isCurrent = currentTrack?.id === track.id;
  const isPlayingThis = isCurrent && isPlaying;

  const handlePlayClick = () => {
    if (isCurrent) {
      onTogglePlay();
    } else {
      onPlayTrack(track);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Label indicator */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 font-mono">
          ALBUM ARTWORK CARD
        </span>
        <span className="neo-sticker bg-[#FFE853] text-slate-900 text-[10px] py-0.5 px-2 rotate-[-2deg]">
          FEATURED
        </span>
      </div>

      {/* Main Cobalt Blue Neo Card (As seen in reference image: #2B50D9) */}
      <div className="neo-card flex-1 flex flex-col justify-between p-5 sm:p-6 bg-[#2B50D9] text-white relative overflow-hidden border-2 border-slate-900 shadow-[4px_4px_0px_#18181b]">
        
        {/* Subtle Decorative Geometric Memphis accents */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-blue-400/20 pointer-events-none" />

        {/* Central Album Artwork with Rounded Inner Card & Vinyl Motif */}
        <div className="relative mx-auto my-2 group">
          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden bg-slate-950 border-2 border-white/90 shadow-[4px_4px_0px_#18181b] relative z-10">
            <img
              src={track.coverUrl}
              alt={track.album}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-700 ${isPlayingThis ? 'scale-105' : 'group-hover:scale-105'}`}
            />
            {/* Ambient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white border border-white/20">
                DELUXE
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1">
                ★ 4.9 RATING
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Metadata & Controls (As seen in reference image: LUNA, EUPHORIA, big Play button) */}
        <div className="mt-4 pt-3 border-t-2 border-white/20 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-black tracking-widest uppercase text-blue-200">
              {track.artist}
            </p>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white truncate">
              {track.album || track.title}
            </h3>
          </div>

          {/* Right Action Cluster: Shuffle, Big White Play Button, Loop */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Big White Circular Play Button with dark border & shadow */}
            <button
              onClick={handlePlayClick}
              title={isPlayingThis ? 'Jeda Lagu' : 'Putar Album'}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white text-[#2B50D9] border-2 border-slate-900 shadow-[3px_3px_0px_#18181b] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            >
              {isPlayingThis ? (
                <Pause size={22} className="fill-[#2B50D9]" />
              ) : (
                <Play size={22} className="fill-[#2B50D9] translate-x-0.5" />
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
