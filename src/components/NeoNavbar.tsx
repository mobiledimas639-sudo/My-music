import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Download, Upload, Youtube, X, Disc } from 'lucide-react';
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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showBackupMenu, setShowBackupMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync search input if activeView is search
  useEffect(() => {
    if (activeView.type === 'search') {
      setSearchInput(activeView.query);
    }
  }, [activeView]);

  // Focus mobile input when opened
  useEffect(() => {
    if (isMobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  // Debounced search
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
      setIsMobileSearchOpen(false);
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
    <header className="sticky top-0 z-30 w-full bg-[#FAF7F2]/95 backdrop-blur-md px-3 sm:px-6 lg:px-10 py-2 sm:py-2.5 border-b-2 border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Left: MUSIC APP wordmark + BETA sticker */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setActiveView({ type: 'home' });
              setIsMobileSearchOpen(false);
            }}
            className="flex items-center gap-2 text-left group focus:outline-none"
            title="Beranda Musik"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#2B50D9] border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] flex items-center justify-center text-white group-hover:rotate-6 transition-transform">
              <Disc className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 font-sans">
                MUSIC APP
              </span>
              <span className="neo-sticker bg-[#18181B] text-white rotate-[-3deg] text-[9px] sm:text-[10px] py-0.5 px-1.5 font-mono">
                BETA
              </span>
            </div>
          </button>
        </div>

        {/* Center: Search pill bar (Desktop & Tablet) */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari lagu, musisi, album, atau 30-min mix..."
              className="w-full pl-10 pr-9 py-2 text-xs md:text-sm font-medium bg-white text-slate-900 placeholder-slate-400 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] focus:outline-none focus:shadow-[3px_3px_0px_#18181b] transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setActiveView({ type: 'home' });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-900 rounded-full"
                title="Hapus pencarian"
              >
                <X size={13} />
              </button>
            )}
          </form>
        </div>

        {/* Right: Quick actions + User Profile Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Mobile search toggle button */}
          <button
            onClick={() => {
              if (activeView.type !== 'search') {
                setActiveView({ type: 'search', query: '' });
              } else {
                setIsMobileSearchOpen(!isMobileSearchOpen);
              }
            }}
            title="Buka Pencarian"
            className="sm:hidden p-2 text-slate-900 bg-white border-2 border-slate-900 rounded-xl shadow-[1.5px_1.5px_0px_#18181b] active:scale-95 transition-all"
          >
            <Search size={15} />
          </button>

          {/* Quick YouTube Mode Toggle */}
          <button
            onClick={onToggleYouTubeMode}
            title={isYouTubeMode ? 'Mode Audio Penuh Aktif' : 'Ganti ke Mode Video YouTube'}
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
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl sm:rounded-full bg-[#FFE853] text-slate-950 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_#18181b] active:scale-95 transition-all"
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span className="hidden md:inline font-black uppercase text-[11px]">Playlist</span>
          </button>

          {/* Library Backup Menu */}
          <div className="relative">
            <button
              onClick={() => setShowBackupMenu(!showBackupMenu)}
              title="Backup & Cadangan Playlist"
              className="p-1.5 sm:p-2 text-slate-900 bg-white border-2 border-slate-900 rounded-xl sm:rounded-full shadow-[1.5px_1.5px_0px_#18181b] active:scale-95 transition-all"
            >
              <Download size={15} />
            </button>

            {showBackupMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_#18181b] p-2 z-50 animate-pop-float">
                <p className="text-[10px] font-black uppercase text-slate-500 px-3 py-1 tracking-wider border-b border-slate-100">
                  Data &amp; Cadangan
                </p>
                <button
                  onClick={() => {
                    onExportBackup();
                    setShowBackupMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-800 hover:bg-[#FFE853]/50 rounded-lg text-left transition-colors"
                >
                  <Download size={14} className="text-[#2B50D9]" />
                  <span>Export Backup JSON</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-800 hover:bg-[#FFE853]/50 rounded-lg text-left transition-colors"
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

          {/* User Profile Avatar with Crisp Border */}
          <div 
            title="Profil Pengguna"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-[#FFE853] border-2 border-slate-900 shadow-[1.5px_1.5px_0px_#18181b] flex items-center justify-center cursor-pointer hover:rotate-6 transition-transform shrink-0"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

      {/* Expandable Mobile Search bar (Only shown when explicitly toggled on mobile) */}
      {isMobileSearchOpen && (
        <div className="mt-2 sm:hidden pt-1">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              ref={mobileInputRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari lagu, artis, atau 30-min mix..."
              className="w-full pl-9 pr-8 py-2 text-xs font-medium bg-white text-slate-900 placeholder-slate-400 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-900"
              >
                <X size={13} />
              </button>
            )}
          </form>
        </div>
      )}
    </header>
  );
};
