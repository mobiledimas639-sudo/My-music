import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Download, Upload, Youtube, Menu, X, Sparkles, Disc } from 'lucide-react';
import { ActiveView } from '../types/music';

interface NeoNavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onSearch: (query: string) => void;
  onOpenCreatePlaylist: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonContent: string) => void;
  onToggleYouTubeMode: () => void;
  isYouTubeMode: boolean;
}

export const NeoNavbar: React.FC<NeoNavbarProps> = ({
  activeView,
  setActiveView,
  onSearch,
  onOpenCreatePlaylist,
  onExportBackup,
  onImportBackup,
  onToggleYouTubeMode,
  isYouTubeMode
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [showBackupMenu, setShowBackupMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync search input if activeView is search
  useEffect(() => {
    if (activeView.type === 'search') {
      setSearchInput(activeView.query);
    }
  }, [activeView]);

  // Debounced live search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim().length >= 2) {
        onSearch(searchInput.trim());
        if (activeView.type !== 'search') {
          setActiveView({ type: 'search', query: searchInput.trim() });
        }
      }
    }, 400);

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
    <header className="sticky top-0 z-30 w-full bg-[#FAF7F2]/95 backdrop-blur-md px-4 sm:px-6 lg:px-10 py-3 sm:py-3.5 border-b-2 border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: MUSIC APP wordmark + BETA sticker badge (Clean without sidebar button) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView({ type: 'home' })}
            className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2B50D9] border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] flex items-center justify-center text-white group-hover:rotate-6 transition-transform">
              <Disc className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black uppercase tracking-tight text-slate-900 font-sans">
                MUSIC APP
              </span>
              <span className="neo-sticker bg-[#18181B] text-white rotate-[-3deg] text-[10px] py-0.5 px-2">
                BETA
              </span>
            </div>
          </button>
        </div>

        {/* Center: Search pill bar (As seen in reference image) */}
        <div className="flex-1 max-w-lg mx-2 hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search songs, artists, albums, or 30-min mixes..."
              className="w-full pl-11 pr-10 py-2.5 text-xs md:text-sm font-medium bg-white text-slate-900 placeholder-slate-400 rounded-full border-2 border-slate-900 shadow-[3px_3px_0px_#18181b] focus:outline-none focus:shadow-[4px_4px_0px_#18181b] transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setActiveView({ type: 'home' });
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-900 rounded-full"
              >
                <X size={14} />
              </button>
            )}
          </form>
        </div>

        {/* Right: Quick actions + User Profile Avatar */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick YouTube Toggle */}
          <button
            onClick={onToggleYouTubeMode}
            title={isYouTubeMode ? 'Mode Audio Penuh Aktif' : 'Ganti ke Mode YouTube'}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full neo-btn ${
              isYouTubeMode
                ? 'bg-[#FF6F59] text-white'
                : 'bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Youtube size={15} className={isYouTubeMode ? 'text-white' : 'text-red-600'} />
            <span className="hidden xl:inline">{isYouTubeMode ? 'Full YouTube' : 'Audio Stream'}</span>
          </button>

          {/* New Playlist button */}
          <button
            onClick={onOpenCreatePlaylist}
            title="Buat Playlist Baru"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full bg-[#FFE853] text-slate-900 neo-btn"
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span className="hidden md:inline">Playlist</span>
          </button>

          {/* Library Backup Menu */}
          <div className="relative">
            <button
              onClick={() => setShowBackupMenu(!showBackupMenu)}
              title="Backup & Restore Library"
              className="p-2 text-slate-800 bg-white rounded-full neo-btn"
            >
              <Download size={15} />
            </button>

            {showBackupMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white neo-card-sm p-2 z-50 animate-pop-float">
                <p className="text-[10px] font-black uppercase text-slate-500 px-3 py-1 tracking-wider border-b border-slate-200">
                  Data Library
                </p>
                <button
                  onClick={() => {
                    onExportBackup();
                    setShowBackupMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-800 hover:bg-amber-100 rounded-lg text-left transition-colors"
                >
                  <Download size={14} className="text-[#2B50D9]" />
                  <span>Export Backup JSON</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-800 hover:bg-amber-100 rounded-lg text-left transition-colors"
                >
                  <Upload size={14} className="text-[#FF6F59]" />
                  <span>Import Backup JSON</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* User Profile Avatar with Crisp Border (As seen in reference image) */}
          <div 
            title="Profil Pengguna"
            className="w-10 h-10 rounded-full overflow-hidden bg-[#FFE853] border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] flex items-center justify-center cursor-pointer hover:rotate-6 transition-transform"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

      {/* Mobile Search input bar */}
      <div className="mt-2.5 sm:hidden">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search songs, artists..."
            className="w-full pl-10 pr-8 py-2 text-xs font-medium bg-white text-slate-900 placeholder-slate-400 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] focus:outline-none"
          />
        </form>
      </div>
    </header>
  );
};
