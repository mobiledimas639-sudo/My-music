import React, { useState } from 'react';
import { Play, Pause, UserPlus, Check, Radio, Sparkles } from 'lucide-react';
import { Track } from '../types/music';

interface NeoArtistCardProps {
  artistTrack: Track;
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
}

export const NeoArtistCard: React.FC<NeoArtistCardProps> = ({
  artistTrack,
  currentTrack,
  isPlaying,
  onPlayTrack
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'tracks' | 'albums' | 'about'>('tracks');

  const isCurrent = currentTrack?.id === artistTrack.id;
  const isPlayingThis = isCurrent && isPlaying;

  return (
    <div className="flex flex-col h-full">
      {/* Label indicator */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 font-mono">
          ARTIST PROFILE CARD
        </span>
        <span className="neo-sticker bg-[#C8C4FC] text-slate-900 text-[10px] py-0.5 px-2 rotate-[-2deg]">
          VERIFIED
        </span>
      </div>

      {/* Main Neo Card */}
      <div className="neo-card flex-1 flex flex-col justify-between p-5 sm:p-6 bg-white relative overflow-visible">
        
        {/* Tilted TRENDING sticker badge (As seen in reference image) */}
        <div className="absolute -top-3.5 right-6 z-10">
          <span className="neo-sticker bg-[#FF7E67] text-white text-xs py-1 px-3.5 rotate-[4deg] shadow-[2px_2px_0px_#18181b]">
            TRENDING
          </span>
        </div>

        <div>
          {/* Circular Artist Avatar with colored border (As seen in reference image) */}
          <div className="flex items-center gap-4 mt-1">
            <div className="relative">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-amber-100 border-2 border-slate-900 shadow-[3px_3px_0px_#18181b]">
                <img
                  src={artistTrack.coverUrl}
                  alt={artistTrack.artist}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FFE853] border-2 border-slate-900 flex items-center justify-center text-[10px] font-black">
                ★
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 truncate">
                  {artistTrack.artist}
                </h3>
              </div>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                Pop & Electronic Artist
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs font-mono font-bold text-slate-500">
                <span className="text-slate-900 font-extrabold">1.2M</span> Followers
                <span>•</span>
                <span className="text-slate-900 font-extrabold">18</span> Tracks
              </div>
            </div>
          </div>

          {/* Action Buttons: Follow (Cobalt blue) + Play Radio */}
          <div className="flex items-center gap-2.5 mt-5">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider neo-btn ${
                isFollowing
                  ? 'bg-[#86E3CE] text-slate-950'
                  : 'bg-[#2B50D9] text-white hover:bg-[#2343b8]'
              }`}
            >
              {isFollowing ? (
                <>
                  <Check size={14} className="stroke-[3]" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus size={14} />
                  <span>Follow</span>
                </>
              )}
            </button>

            <button
              onClick={() => onPlayTrack(artistTrack)}
              title="Putar Track Artis"
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white text-slate-900 text-xs font-black uppercase tracking-wider neo-btn"
            >
              {isPlayingThis ? (
                <>
                  <Pause size={14} className="fill-slate-900" />
                  <span>Jeda</span>
                </>
              ) : (
                <>
                  <Play size={14} className="fill-slate-900" />
                  <span>Putar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mini Tab Bar (As seen in reference image: Top Tracks, Albums, About) */}
        <div className="mt-5 pt-3 border-t-2 border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab('tracks')}
              className={`pb-1 px-2 border-b-2 font-black transition-colors ${
                activeTab === 'tracks' ? 'border-[#2B50D9] text-[#2B50D9]' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Top Tracks
            </button>
            <button
              onClick={() => setActiveTab('albums')}
              className={`pb-1 px-2 border-b-2 font-black transition-colors ${
                activeTab === 'albums' ? 'border-[#2B50D9] text-[#2B50D9]' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Albums
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-1 px-2 border-b-2 font-black transition-colors ${
                activeTab === 'about' ? 'border-[#2B50D9] text-[#2B50D9]' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              About
            </button>
          </div>

          <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            {activeTab === 'tracks' && (
              <div 
                onClick={() => onPlayTrack(artistTrack)}
                className="flex items-center justify-between cursor-pointer hover:bg-white p-1.5 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono font-bold text-slate-400">1</span>
                  <span className="font-bold text-slate-900 truncate">{artistTrack.title}</span>
                </div>
                <span className="font-mono text-slate-500 text-[11px]">3:35</span>
              </div>
            )}
            {activeTab === 'albums' && (
              <p className="text-slate-600 text-center py-1 font-medium">
                Supernova (2024), Starlight EP
              </p>
            )}
            {activeTab === 'about' && (
              <p className="text-slate-600 text-center py-1 text-[11px] font-medium leading-relaxed">
                Pencipta harmoni synth-pop & ambient cosmic modern.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
