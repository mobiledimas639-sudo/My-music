import React from 'react';
import { Home, Search, Heart, Plus, Music, Trash2, X, Sparkles, Disc, Download, Upload } from 'lucide-react';
import { ActiveView, Playlist } from '../types/music';

interface NeoSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  playlists: Playlist[];
  likedTracksCount: number;
  onOpenCreatePlaylist: () => void;
  onDeletePlaylist: (id: string, name: string) => void;
  onExportBackup?: () => void;
}

export const NeoSidebarDrawer: React.FC<NeoSidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeView,
  setActiveView,
  playlists,
  likedTracksCount,
  onOpenCreatePlaylist,
  onDeletePlaylist,
  onExportBackup
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity"
      />

      {/* Slide-over Drawer */}
      <aside className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white border-r-2 border-slate-900 z-50 flex flex-col shadow-[8px_0px_0px_#18181b] animate-slideRight">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b-2 border-slate-900 bg-[#FFE853]">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black uppercase text-slate-950">MUSIC APP</span>
            <span className="neo-sticker bg-[#18181B] text-white text-[9px] py-0 px-1.5 rotate-[-2deg]">
              NAVIGASI
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-900 bg-white border border-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Primary Nav Links */}
        <div className="p-4 space-y-2 border-b-2 border-slate-100">
          <button
            onClick={() => {
              setActiveView({ type: 'home' });
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeView.type === 'home'
                ? 'bg-[#2B50D9] text-white border-2 border-slate-900 shadow-[2px_2px_0px_#18181b]'
                : 'text-slate-800 hover:bg-amber-50/80 border-2 border-transparent'
            }`}
          >
            <Home size={16} />
            <span>Beranda Utama</span>
          </button>

          <button
            onClick={() => {
              setActiveView({ type: 'search', query: '' });
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeView.type === 'search'
                ? 'bg-[#2B50D9] text-white border-2 border-slate-900 shadow-[2px_2px_0px_#18181b]'
                : 'text-slate-800 hover:bg-amber-50/80 border-2 border-transparent'
            }`}
          >
            <Search size={16} />
            <span>Jelajahi & Cari</span>
          </button>

          <button
            onClick={() => {
              setActiveView({ type: 'liked' });
              onClose();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeView.type === 'liked'
                ? 'bg-[#FF6F59] text-white border-2 border-slate-900 shadow-[2px_2px_0px_#18181b]'
                : 'text-slate-800 hover:bg-amber-50/80 border-2 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart size={16} className={activeView.type === 'liked' ? 'fill-white' : ''} />
              <span>Lagu Disukai</span>
            </div>
            {likedTracksCount > 0 && (
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-900 border border-slate-900">
                {likedTracksCount}
              </span>
            )}
          </button>
        </div>

        {/* Playlists Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500">
              Koleksi Playlist
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenCreatePlaylist();
              }}
              className="p-1 rounded-lg bg-[#FFE853] text-slate-950 border border-slate-900 hover:scale-105 transition-transform"
              title="Buat Playlist Baru"
            >
              <Plus size={14} className="stroke-[3]" />
            </button>
          </div>

          <div className="space-y-1.5">
            {playlists.map(pl => {
              const isActive = activeView.type === 'playlist' && activeView.playlistId === pl.id;

              return (
                <div
                  key={pl.id}
                  onClick={() => {
                    setActiveView({ type: 'playlist', playlistId: pl.id });
                    onClose();
                  }}
                  className={`group flex items-center justify-between p-2 rounded-xl cursor-pointer border-2 transition-all ${
                    isActive 
                      ? 'bg-[#FFE853]/50 border-slate-900 shadow-[2px_2px_0px_#18181b]' 
                      : 'hover:bg-amber-50/70 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${pl.coverGradient || 'from-rose-500 to-amber-500'} border border-slate-900 flex items-center justify-center shrink-0`}>
                      <Music size={13} className="text-slate-950" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-black uppercase text-slate-900 truncate">
                        {pl.name}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500">
                        {pl.tracks.length} Lagu
                      </div>
                    </div>
                  </div>

                  {pl.id.startsWith('custom-') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePlaylist(pl.id, pl.name);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 rounded transition-opacity"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        {onExportBackup && (
          <div className="p-3 border-t-2 border-slate-100 bg-slate-50">
            <button
              onClick={() => {
                onExportBackup();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-slate-700 bg-white border border-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Download size={13} />
              <span>Unduh Cadangan JSON</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
