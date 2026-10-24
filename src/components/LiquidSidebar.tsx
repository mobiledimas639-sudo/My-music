import React from 'react';
import { Home, Search, Heart, ListMusic, Plus, Music, Trash2, X } from 'lucide-react';
import { ActiveView, Playlist } from '../types/music';

interface LiquidSidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  playlists: Playlist[];
  likedTracksCount: number;
  onOpenCreatePlaylist: () => void;
  onDeletePlaylist: (id: string, name: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const LiquidSidebar: React.FC<LiquidSidebarProps> = ({
  activeView,
  setActiveView,
  playlists,
  likedTracksCount,
  onOpenCreatePlaylist,
  onDeletePlaylist,
  isOpenMobile,
  onCloseMobile
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-16 bottom-24 left-0 z-40 w-64 glass-panel border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-white/10">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Navigasi</span>
          <button 
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Primary Nav Links */}
        <div className="p-3 space-y-1">
          <button
            onClick={() => {
              setActiveView({ type: 'home' });
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeView.type === 'home'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home size={18} className={activeView.type === 'home' ? 'text-emerald-400' : 'text-slate-400'} />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => {
              setActiveView({ type: 'search', query: '' });
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeView.type === 'search'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search size={18} className={activeView.type === 'search' ? 'text-emerald-400' : 'text-slate-400'} />
            <span>Jelajahi & Cari</span>
          </button>

          <button
            onClick={() => {
              setActiveView({ type: 'liked' });
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeView.type === 'liked'
                ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/10 text-violet-300 border border-violet-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart size={18} className={activeView.type === 'liked' ? 'text-violet-400 fill-violet-400' : 'text-slate-400'} />
              <span>Lagu Favorit</span>
            </div>
            {likedTracksCount > 0 && (
              <span className="text-[11px] font-mono text-slate-400 px-1.5 py-0.5 rounded-md bg-white/5">
                {likedTracksCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveView({ type: 'queue' });
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeView.type === 'queue'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ListMusic size={18} className={activeView.type === 'queue' ? 'text-emerald-400' : 'text-slate-400'} />
            <span>Antrean Putar</span>
          </button>
        </div>

        {/* Playlists Header */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between border-t border-white/5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Playlist Kustom ({playlists.length})
          </span>
          <button
            onClick={onOpenCreatePlaylist}
            title="Buat Playlist Baru"
            className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Playlists List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1">
          {playlists.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-slate-500">
              <p>Belum ada playlist kustom.</p>
              <button
                onClick={onOpenCreatePlaylist}
                className="mt-2 text-emerald-400 hover:underline font-medium"
              >
                + Buat yang pertama
              </button>
            </div>
          ) : (
            playlists.map((playlist) => {
              const isSelected = activeView.type === 'playlist' && activeView.playlistId === playlist.id;
              return (
                <div
                  key={playlist.id}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                    isSelected
                      ? 'bg-white/10 text-white font-medium border border-white/15'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <button
                    onClick={() => {
                      setActiveView({ type: 'playlist', playlistId: playlist.id });
                      onCloseMobile();
                    }}
                    className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${playlist.coverGradient || 'from-emerald-600 to-teal-800'} flex items-center justify-center shrink-0 border border-white/10 shadow-sm`}>
                      <Music size={12} className="text-white/80" />
                    </div>
                    <div className="truncate">
                      <div className="truncate text-slate-200 group-hover:text-white font-medium">
                        {playlist.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {playlist.tracks.length} lagu
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePlaylist(playlist.id, playlist.name);
                    }}
                    title="Hapus playlist"
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Liquid Glass Footer Badge */}
        <div className="p-3 border-t border-white/5 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Audio Engine: iTunes API</span>
          <span className="text-emerald-400/80 font-mono">Online</span>
        </div>
      </aside>
    </>
  );
};
