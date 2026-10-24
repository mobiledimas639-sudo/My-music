import React from 'react';
import { X, Play, Trash2, ListMusic, Music } from 'lucide-react';
import { Track } from '../types/music';
import { formatTime } from '../services/musicApi';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  queue: Track[];
  queueIndex: number;
  currentTrack: Track | null;
  isPlaying: boolean;
  onSelectTrack: (track: Track, newQueue?: Track[]) => void;
  onRemoveFromQueue: (index: number) => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  queue,
  queueIndex,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onRemoveFromQueue
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white border-l-2 border-slate-900 z-50 flex flex-col shadow-[-8px_0px_0px_#18181b] animate-slideLeft">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b-2 border-slate-900 bg-[#FFE853]">
          <div className="flex items-center gap-2">
            <ListMusic size={18} className="text-slate-950" />
            <h3 className="text-sm font-black uppercase text-slate-950">
              Antrean Putar ({queue.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-900 bg-white border border-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Now Playing Section */}
          {currentTrack && (
            <div>
              <span className="neo-sticker bg-[#86E3CE] text-slate-950 text-[10px] py-0.5 px-2 rotate-[-1deg]">
                SEDANG DIPUTAR
              </span>
              <div className="mt-2 p-3 rounded-2xl bg-[#FFE853]/40 border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover bg-slate-900 border-2 border-slate-900 shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-black text-xs text-slate-950 truncate uppercase">
                      {currentTrack.title}
                    </div>
                    <div className="text-[11px] font-bold text-slate-600 truncate">
                      {currentTrack.artist}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-slate-800 shrink-0">
                  {formatTime(currentTrack.duration)}
                </span>
              </div>
            </div>
          )}

          {/* Queue List */}
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Berikutnya ({queue.length})
            </span>

            {queue.length === 0 ? (
              <div className="py-10 text-center text-xs font-bold text-slate-400">
                Antrean lagu kosong
              </div>
            ) : (
              <div className="mt-2 divide-y-2 divide-slate-100 border-2 border-slate-900 rounded-2xl overflow-hidden bg-white shadow-[2px_2px_0px_#18181b]">
                {queue.map((track, i) => {
                  const isCurrent = currentTrack?.id === track.id;

                  return (
                    <div
                      key={`${track.id}-${i}`}
                      onClick={() => onSelectTrack(track, queue)}
                      className={`group flex items-center justify-between p-2.5 transition-all cursor-pointer ${
                        isCurrent ? 'bg-[#FFE853]/30 font-bold' : 'hover:bg-amber-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 text-center font-mono font-bold text-xs text-slate-400">
                          {i + 1}
                        </span>
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover bg-slate-900 border border-slate-900 shrink-0"
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {track.title}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {track.artist}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-mono text-slate-500">
                          {formatTime(track.duration)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromQueue(i);
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
