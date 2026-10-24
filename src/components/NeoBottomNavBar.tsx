import React from 'react';
import { Home, Search, Heart, Disc3 } from 'lucide-react';
import { ActiveView } from '../types/music';

interface NeoBottomNavBarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  likedTracksCount: number;
  playlistsCount: number;
}

export const NeoBottomNavBar: React.FC<NeoBottomNavBarProps> = ({
  activeView,
  setActiveView,
  likedTracksCount,
  playlistsCount
}) => {
  const isHome = activeView.type === 'home';
  const isSearch = activeView.type === 'search';
  const isLiked = activeView.type === 'liked';
  const isPlaylist = activeView.type === 'playlists' || activeView.type === 'playlist';

  return (
    <nav 
      aria-label="Navigasi Bawah Ponsel"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-slate-900 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-2 sm:px-6 py-1.5"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1.5 items-center">
        
        {/* 1. BERANDA (HOME) */}
        <button
          onClick={() => setActiveView({ type: 'home' })}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all select-none ${
            isHome
              ? 'bg-[#FFE853] text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] translate-y-[-2px]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-2 border-transparent'
          }`}
          title="Beranda Utama"
        >
          <Home size={19} className={isHome ? 'stroke-[2.5]' : 'stroke-2'} />
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-tight mt-0.5">
            Beranda
          </span>
        </button>

        {/* 2. JELAJAHI & CARI (EXPLORE & SEARCH) */}
        <button
          onClick={() => setActiveView({ type: 'search', query: '' })}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all select-none ${
            isSearch
              ? 'bg-[#2B50D9] text-white font-black border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] translate-y-[-2px]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-2 border-transparent'
          }`}
          title="Jelajahi dan Cari Lagu"
        >
          <Search size={19} className={isSearch ? 'stroke-[2.5]' : 'stroke-2'} />
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-tight mt-0.5">
            Jelajahi
          </span>
        </button>

        {/* 3. LAGU FAVORIT (LIKED SONGS) */}
        <button
          onClick={() => setActiveView({ type: 'liked' })}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative select-none ${
            isLiked
              ? 'bg-[#FF6F59] text-white font-black border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] translate-y-[-2px]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-2 border-transparent'
          }`}
          title="Lagu Favorit / Disukai"
        >
          <div className="relative">
            <Heart size={19} className={isLiked ? 'fill-white stroke-[2.5]' : 'stroke-2'} />
            {likedTracksCount > 0 && (
              <span className={`absolute -top-1.5 -right-2.5 font-mono text-[9px] font-black px-1 rounded-full border border-slate-900 ${
                isLiked ? 'bg-[#FFE853] text-slate-950' : 'bg-[#FF6F59] text-white'
              }`}>
                {likedTracksCount}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-tight mt-0.5">
            Favorit
          </span>
        </button>

        {/* 4. KOLEKSI PLAYLIST (DIRECT VIEW) */}
        <button
          onClick={() => setActiveView({ type: 'playlists' })}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative select-none ${
            isPlaylist
              ? 'bg-[#86E3CE] text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] translate-y-[-2px]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-2 border-transparent'
          }`}
          title="Koleksi Playlist"
        >
          <div className="relative">
            <Disc3 size={19} className={isPlaylist ? 'stroke-[2.5] animate-spin' : 'stroke-2'} style={{ animationDuration: '6s' }} />
            {playlistsCount > 0 && (
              <span className={`absolute -top-1.5 -right-2.5 font-mono text-[9px] font-black px-1 rounded-full border border-slate-900 ${
                isPlaylist ? 'bg-white text-slate-950' : 'bg-[#86E3CE] text-slate-950'
              }`}>
                {playlistsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-tight mt-0.5">
            Playlist
          </span>
        </button>

      </div>
    </nav>
  );
};
