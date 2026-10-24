import React from 'react';
import { X, Check, Plus, Music } from 'lucide-react';
import { Track, Playlist } from '../types/music';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  playlists: Playlist[];
  onAddTrackToPlaylist: (playlistId: string, trackId: Track) => boolean;
  onRemoveTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  onOpenCreatePlaylist: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  track,
  playlists,
  onAddTrackToPlaylist,
  onRemoveTrackFromPlaylist,
  onOpenCreatePlaylist
}) => {
  if (!isOpen || !track) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-sm neo-card bg-white p-0 overflow-hidden shadow-[8px_8px_0px_#18181b]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b-2 border-slate-900 bg-[#FFE853]">
          <div>
            <h3 className="text-sm font-black uppercase text-slate-950">Tambahkan ke Playlist</h3>
            <p className="text-[11px] font-bold text-slate-700 truncate max-w-[240px]">
              {track.title} • {track.artist}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-900 bg-white border border-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Playlists List */}
        <div className="p-3 max-h-72 overflow-y-auto space-y-2">
          {playlists.length === 0 ? (
            <div className="py-6 text-center text-xs font-bold text-slate-500">
              <p>Belum ada playlist kustom.</p>
            </div>
          ) : (
            playlists.map((playlist) => {
              const isIncluded = playlist.tracks.some(t => t.id === track.id);

              return (
                <button
                  key={playlist.id}
                  onClick={() => {
                    if (isIncluded) {
                      onRemoveTrackFromPlaylist(playlist.id, track.id);
                    } else {
                      onAddTrackToPlaylist(playlist.id, track);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all border-2 ${
                    isIncluded
                      ? 'bg-[#FFE853]/50 border-slate-900 shadow-[2px_2px_0px_#18181b]'
                      : 'hover:bg-amber-50/60 border-slate-200 hover:border-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${playlist.coverGradient || 'from-[#FF7E67] to-[#FFE853]'} border border-slate-900 flex items-center justify-center shrink-0`}>
                      <Music size={14} className="text-slate-950" />
                    </div>
                    <div className="text-left truncate">
                      <div className="font-black uppercase text-slate-900 truncate">
                        {playlist.name}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500">
                        {playlist.tracks.length} lagu
                      </div>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-lg border-2 border-slate-900 flex items-center justify-center shrink-0 transition-colors ${
                    isIncluded 
                      ? 'bg-[#2B50D9] text-white font-bold' 
                      : 'bg-white text-transparent'
                  }`}>
                    {isIncluded && <Check size={14} className="stroke-[3]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 px-5 border-t-2 border-slate-900 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenCreatePlaylist();
            }}
            className="flex items-center gap-1.5 text-xs font-black uppercase text-[#2B50D9] hover:underline"
          >
            <Plus size={14} className="stroke-[3]" />
            <span>Buat Playlist Baru</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-black uppercase tracking-wider bg-white text-slate-950 border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
