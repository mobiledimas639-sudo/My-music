import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Sparkles, Download, Upload, Youtube, Menu, X } from 'lucide-react';
import { ActiveView } from '../types/music';

interface LiquidNavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onSearch: (query: string) => void;
  onOpenCreatePlaylist: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonContent: string) => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
  onToggleYouTubeMode: () => void;
  isYouTubeMode: boolean;
}

export const LiquidNavbar: React.FC<LiquidNavbarProps> = ({
  activeView,
  setActiveView,
  onSearch,
  onOpenCreatePlaylist,
  onExportBackup,
  onImportBackup,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
  onToggleYouTubeMode,
  isYouTubeMode
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [showBackupMenu, setShowBackupMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Debounced live search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim().length >= 2) {
        onSearch(searchInput.trim());
        if (activeView.type !== 'search') {
          setActiveView({ type: 'search', query: searchInput.trim() });
        }
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchInput, onSearch, activeView.type, setActiveView]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setActiveView({ type: 'search', query: searchInput.trim() });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onImportBackup(content);
        }
      };
      reader.readAsText(file);
    }
    if (e.target) e.target.value = '';
    setShowBackupMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full glass-panel px-4 lg:px-8 flex items-center justify-between gap-4 md:gap-8 border-b border-white/10 transition-colors">
      {/* Zone 1: Mobile toggle + Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Toggle Menu"
          className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <button
          onClick={() => setActiveView({ type: 'home' })}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-violet-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Aurora<span className="text-emerald-400 font-extrabold">Sound</span>
          </span>
        </button>
      </div>

      {/* Zone 2: Search input bar + concise navigation links */}
      <div className="flex-1 max-w-xl flex items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari lagu, 30 menit non-stop, atau artis..."
            className="w-full h-10 pl-10 pr-10 text-xs md:text-sm bg-slate-950/40 border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 backdrop-blur-md transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              <X size={14} />
            </button>
          )}
        </form>

        <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-slate-300">
          <button
            onClick={() => setActiveView({ type: 'home' })}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeView.type === 'home' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => setActiveView({ type: 'liked' })}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeView.type === 'liked' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Lagu Favorit
          </button>
        </nav>
      </div>

      {/* Zone 3: Actions (YouTube Mode, Backup, + Playlist) */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* YouTube Mode Button */}
        <button
          onClick={onToggleYouTubeMode}
          title="Toggle YouTube Video/Audio Mode"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isYouTubeMode 
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/20' 
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          <Youtube className={`w-3.5 h-3.5 ${isYouTubeMode ? 'text-rose-400' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">Mode YouTube</span>
        </button>

        {/* Backup / Export / Import Menu */}
        <div className="relative">
          <button
            onClick={() => setShowBackupMenu(prev => !prev)}
            title="Cadangan & Pulihkan Playlist JSON"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-slate-300 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Cadangan JSON</span>
          </button>

          {showBackupMenu && (
            <div className="absolute right-0 mt-2 w-48 glass-panel-elevated rounded-xl p-1.5 z-50 text-xs shadow-2xl border border-white/15">
              <button
                onClick={() => {
                  onExportBackup();
                  setShowBackupMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Download size={14} className="text-emerald-400" />
                <span>Unduh Cadangan (.json)</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Upload size={14} className="text-violet-400" />
                <span>Impor File Backup</span>
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Create Playlist Primary Button */}
        <button
          onClick={onOpenCreatePlaylist}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold rounded-xl text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all whitespace-nowrap"
        >
          <Plus size={15} />
          <span>Buat Playlist</span>
        </button>
      </div>
    </header>
  );
};
