import React, { useState } from 'react';
import { Search, LayoutGrid, List, Sparkles, Loader2, Music, Youtube, Radio } from 'lucide-react';
import { Track } from '../types/music';
import { TrackCard } from './TrackCard';
import { TrackRow } from './TrackRow';

interface SearchViewProps {
  query: string;
  tracks: Track[];
  isLoading: boolean;
  currentTrack: Track | null;
  isPlaying: boolean;
  isLiked: (trackId: string) => boolean;
  onSearch: (newQuery: string) => void;
  onPlayTrack: (track: Track, queue?: Track[]) => void;
  onTogglePlay: () => void;
  onToggleLike: (track: Track) => void;
  onAddToPlaylist: (track: Track) => void;
  onOpenYouTube: (track: Track) => void;
}

const SEARCH_SUGGESTIONS = [
  '30 Menit Non Stop',
  'DJ Campuran Viral TikTok',
  'Lo-Fi Study 30 Min',
  'Pop Indonesia Santai',
  'Tulus',
  'The Weeknd',
  'Mahalini',
  'Coldplay',
  'Synthwave Ambient',
  'Akustik Kafe 30 Min',
  'Taylor Swift'
];

export const SearchView: React.FC<SearchViewProps> = ({
  query,
  tracks,
  isLoading,
  currentTrack,
  isPlaying,
  isLiked,
  onSearch,
  onPlayTrack,
  onTogglePlay,
  onToggleLike,
  onAddToPlaylist,
  onOpenYouTube
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localInput, setLocalInput] = useState(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localInput.trim()) {
      onSearch(localInput.trim());
    }
  };

  return (
    <div className="space-y-6 pb-36 sm:pb-28">
      {/* Search Header Banner in Neo-Brutalist Style */}
      <div className="neo-card p-4 sm:p-6 md:p-8 bg-white space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-[#FFE853] text-slate-900 text-xs py-0.5 px-2 rotate-[-2deg]">
              PENCARIAN LENGKAP
            </span>
            <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
              Audio 30-Menit, Lagu Populer &amp; Video Musik
            </span>
          </div>

          <span className="neo-sticker bg-[#86E3CE] text-slate-950 text-[10px] py-0.5 px-2 font-mono font-black">
            SEMUA SUMBER TERGABUNG
          </span>
        </div>

        {/* Big Search Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Ketik judul lagu, musisi, DJ remix, atau '30 min non-stop'..."
            className="w-full pl-10 sm:pl-12 pr-24 sm:pr-28 py-3 sm:py-3.5 bg-slate-50 text-slate-900 placeholder-slate-400 font-bold text-xs sm:text-base rounded-xl sm:rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_#18181b] focus:outline-none focus:shadow-[5px_5px_0px_#18181b] transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#2B50D9] text-white font-black text-xs uppercase tracking-wider rounded-lg sm:rounded-xl neo-btn"
          >
            Cari
          </button>
        </form>

        {/* Suggestion Badges */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500">
            Saran:
          </span>
          {SEARCH_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              onClick={() => {
                setLocalInput(sug);
                onSearch(sug);
              }}
              className="text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#FFE853] text-slate-800 hover:text-slate-950 border border-slate-900 shadow-[1px_1px_0px_#18181b] transition-all active:scale-95"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Controls */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
            <span>Hasil Pencarian:</span>
            <span className="text-[#2B50D9]">"{query || localInput || 'Trending'}"</span>
          </h2>
          <p className="text-xs font-bold text-slate-500 font-mono mt-0.5">
            Ditemukan {tracks.length} lagu siap streaming penuh
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#18181b]">
          <button
            onClick={() => setViewMode('grid')}
            title="Tampilan Grid"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-[#FFE853] text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="Tampilan List"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-[#FFE853] text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Results Grid / List */}
      {isLoading ? (
        <div className="neo-card p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#2B50D9] animate-spin" />
          <p className="text-sm font-black uppercase text-slate-900">
            Mencari lagu terbaik di katalog global...
          </p>
        </div>
      ) : tracks.length === 0 ? (
        <div className="neo-card p-12 text-center space-y-3 bg-white">
          <div className="w-14 h-14 rounded-full bg-[#FFE853] border-2 border-slate-900 flex items-center justify-center mx-auto shadow-[3px_3px_0px_#18181b]">
            <Search className="w-6 h-6 text-slate-900" />
          </div>
          <h3 className="text-base font-black uppercase text-slate-900">
            Tidak ada lagu yang cocok dengan "{query}"
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Coba cari dengan kata kunci lain seperti judul lagu, nama artis, atau klik salah satu saran di atas.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tracks.map(track => (
            <TrackCard
              key={track.id}
              track={track}
              isCurrentTrack={currentTrack?.id === track.id}
              isPlaying={currentTrack?.id === track.id && isPlaying}
              isLiked={isLiked(track.id)}
              onPlay={() => onPlayTrack(track, tracks)}
              onToggleLike={() => onToggleLike(track)}
              onAddToPlaylist={() => onAddToPlaylist(track)}
              onOpenYouTube={() => onOpenYouTube(track)}
            />
          ))}
        </div>
      ) : (
        <div className="neo-card p-2 bg-white divide-y-2 divide-slate-100">
          {tracks.map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              index={i}
              isCurrentTrack={currentTrack?.id === track.id}
              isPlaying={currentTrack?.id === track.id && isPlaying}
              isLiked={isLiked(track.id)}
              onPlay={() => onPlayTrack(track, tracks)}
              onToggleLike={() => onToggleLike(track)}
              onAddToPlaylist={() => onAddToPlaylist(track)}
              onOpenYouTube={() => onOpenYouTube(track)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
