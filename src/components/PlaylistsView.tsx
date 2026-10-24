import React, { useRef } from 'react';
import { 
  Plus, 
  Play, 
  Pause, 
  Heart, 
  Disc, 
  Music, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  FolderHeart,
  ChevronRight,
  ListMusic
} from 'lucide-react';
import { Playlist, Track } from '../types/music';

interface PlaylistsViewProps {
  playlists: Playlist[];
  likedTracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onSelectPlaylist: (playlistId: string) => void;
  onOpenLikedSongs: () => void;
  onPlayPlaylist: (playlist: Playlist) => void;
  onPlayLikedSongs: () => void;
  onOpenCreatePlaylist: () => void;
  onEditPlaylist: (playlist: Playlist) => void;
  onDeletePlaylist: (id: string, name: string) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonContent: string) => void;
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({
  playlists,
  likedTracks,
  currentTrack,
  isPlaying,
  onSelectPlaylist,
  onOpenLikedSongs,
  onPlayPlaylist,
  onPlayLikedSongs,
  onOpenCreatePlaylist,
  onEditPlaylist,
  onDeletePlaylist,
  onExportBackup,
  onImportBackup
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const totalCustomTracks = playlists.reduce((acc, p) => acc + p.tracks.length, 0);
  const totalAllTracks = totalCustomTracks + likedTracks.length;

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
  };

  const isLikedPlaying = isPlaying && likedTracks.some(t => t.id === currentTrack?.id);

  return (
    <div className="space-y-6 pb-36 sm:pb-28">
      
      {/* 1. Hero Header Banner (Matching LikedSongsView Neo-Brutalist Style) */}
      <div className="neo-card p-4 sm:p-6 md:p-8 bg-gradient-to-r from-[#2B50D9] via-[#3B62F0] to-[#6086FF] text-white relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 sm:gap-6 md:gap-8 relative z-10">
          {/* Animated Disc Icon Box */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl sm:rounded-3xl bg-[#FFE853] text-slate-950 border-2 border-slate-900 shadow-[3px_3px_0px_#18181b] flex items-center justify-center shrink-0">
            <ListMusic className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="neo-sticker bg-[#FFE853] text-slate-950 text-[10px] py-0.5 px-2 rotate-[-2deg] font-black">
                PERPUSTAKAAN MUSIK
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-white/90">
                Koleksi &amp; Daftar Putar
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase text-white tracking-tight drop-shadow-sm">
              KOLEKSI PLAYLIST
            </h1>
            <p className="text-xs md:text-sm font-bold text-white/90 max-w-xl">
              Semua daftar putar kustom dan trek favoritmu tersimpan aman dalam browser dan siap diputar non-stop.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-xs font-mono font-bold text-white">
              <span className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/30">
                {playlists.length + 1} Playlist Aktif
              </span>
              <span>•</span>
              <span className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/30">
                {totalAllTracks} Lagu Tersimpan
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="relative z-10 mt-5 pt-4 border-t-2 border-white/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenCreatePlaylist}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFE853] text-slate-950 font-black text-xs uppercase tracking-wider neo-btn shadow-[2px_2px_0px_#18181b]"
            >
              <Plus size={15} className="stroke-[3]" />
              <span>Buat Playlist Baru</span>
            </button>
          </div>

          {/* Backup / Restore JSON */}
          <div className="flex items-center gap-2">
            <button
              onClick={onExportBackup}
              title="Unduh Cadangan JSON"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/30 transition-all active:scale-95"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Cadangkan JSON</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Pulihkan Cadangan JSON"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/30 transition-all active:scale-95"
            >
              <Upload size={13} />
              <span className="hidden sm:inline">Pulihkan JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* 2. Playlist Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm sm:text-base font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
            <span>📚</span> SEMUA DAFTAR PUTAR
          </h2>
          <span className="text-xs font-mono font-bold text-slate-500">
            {playlists.length + 1} Daftar Putar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          
          {/* A. SPECIAL PRIMARY CARD: LAGU DISUKAI (FAVORITES) */}
          <div 
            onClick={onOpenLikedSongs}
            className="neo-card p-4 sm:p-5 bg-gradient-to-br from-[#FF7E67] via-[#FF6F59] to-[#FFA17A] text-slate-950 flex flex-col justify-between cursor-pointer group hover:-translate-y-1 hover:shadow-[5px_5px_0px_#18181b] transition-all relative overflow-hidden"
          >
            {/* Background shape */}
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/20 pointer-events-none" />

            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] flex items-center justify-center shrink-0">
                  <Heart size={22} className="text-[#FF6F59] fill-[#FF6F59]" />
                </div>
                
                <span className="neo-sticker bg-[#18181B] text-white text-[9px] py-0.5 px-2 rotate-[-2deg] font-black">
                  ★ LAGU FAVORIT
                </span>
              </div>

              <h3 className="text-lg font-black uppercase tracking-tight text-slate-950 group-hover:text-white transition-colors">
                LAGU YANG DISUKAI
              </h3>
              <p className="text-xs font-bold text-slate-900/80 mt-1 line-clamp-2">
                Koleksi semua lagu yang kamu beri tanda suka untuk pemutaran cepat.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t-2 border-slate-900 flex items-center justify-between">
              <span className="font-mono text-xs font-black text-slate-950 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-900">
                {likedTracks.length} Lagu Disukai
              </span>

              <div className="flex items-center gap-2">
                {likedTracks.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayLikedSongs();
                    }}
                    title="Putar Semua Lagu Disukai"
                    className="w-9 h-9 rounded-full bg-white text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  >
                    {isLikedPlaying ? (
                      <Pause size={14} className="fill-slate-950" />
                    ) : (
                      <Play size={14} className="fill-slate-950 translate-x-0.5" />
                    )}
                  </button>
                )}
                
                <span className="text-xs font-black uppercase text-slate-950 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Buka <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </div>

          {/* B. CUSTOM USER PLAYLISTS */}
          {playlists.map((playlist) => {
            const isPlaylistActive = isPlaying && playlist.tracks.some(t => t.id === currentTrack?.id);

            return (
              <div
                key={playlist.id}
                onClick={() => onSelectPlaylist(playlist.id)}
                className="neo-card p-4 sm:p-5 bg-white flex flex-col justify-between cursor-pointer group hover:-translate-y-1 hover:shadow-[5px_5px_0px_#18181b] transition-all relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${playlist.coverGradient || 'from-[#FFE853] to-[#86E3CE]'} border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] flex items-center justify-center shrink-0`}>
                      <Music size={22} className="text-slate-950" />
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onEditPlaylist(playlist)}
                        title="Edit Playlist"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#FFE853] border border-slate-900 text-slate-700 hover:text-slate-950 transition-colors"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => onDeletePlaylist(playlist.id, playlist.name)}
                        title="Hapus Playlist"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-500 hover:text-white border border-slate-900 text-slate-700 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 group-hover:text-[#2B50D9] transition-colors line-clamp-1">
                    {playlist.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1 line-clamp-2 min-h-[32px]">
                    {playlist.description || 'Daftar putar kustom pribadi.'}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t-2 border-slate-100 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {playlist.tracks.length} Lagu
                  </span>

                  <div className="flex items-center gap-2">
                    {playlist.tracks.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayPlaylist(playlist);
                        }}
                        title="Putar Seluruh Playlist"
                        className="w-9 h-9 rounded-full bg-[#2B50D9] text-white border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                      >
                        {isPlaylistActive ? (
                          <Pause size={14} className="fill-white" />
                        ) : (
                          <Play size={14} className="fill-white translate-x-0.5" />
                        )}
                      </button>
                    )}

                    <span className="text-xs font-black uppercase text-slate-900 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Lihat <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* C. CREATE PLAYLIST CALLOUT CARD */}
          <div
            onClick={onOpenCreatePlaylist}
            className="neo-card p-6 bg-amber-50/60 border-2 border-dashed border-slate-400 hover:border-slate-900 flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-[#FFE853]/20 transition-all min-h-[190px]"
          >
            <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#18181b] group-hover:scale-110 transition-transform mb-3">
              <Plus size={22} className="stroke-[3] text-slate-900" />
            </div>
            <h4 className="text-sm font-black uppercase text-slate-900">
              Buat Playlist Baru
            </h4>
            <p className="text-[11px] font-bold text-slate-500 mt-1">
              Tambahkan lagu favoritmu ke dalam album kompilasi baru
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
