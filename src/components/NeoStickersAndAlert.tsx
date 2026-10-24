import React, { useState } from 'react';
import { Bell, Sparkles, Heart, Search, X, Flame, Radio, Clock, Plus } from 'lucide-react';
import { ActiveView } from '../types/music';

interface NeoStickersAndAlertProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenCreatePlaylist: () => void;
  onFilterGenre: (genre: string) => void;
}

export const NeoStickersAndAlert: React.FC<NeoStickersAndAlertProps> = ({
  activeView,
  setActiveView,
  onOpenCreatePlaylist,
  onFilterGenre
}) => {
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  return (
    <div className="flex flex-col h-full justify-between gap-3">
      {/* 1. Canary Yellow Notification Banner (As seen in reference image) */}
      {isAlertVisible && (
        <div className="neo-card p-3.5 sm:p-4 bg-[#FFE853] relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] flex items-center justify-center shrink-0 mt-0.5">
                <Bell size={15} className="text-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-900 bg-white/80 px-1.5 py-0.5 rounded border border-slate-900">
                    UPDATE
                  </span>
                  <h4 className="text-xs sm:text-sm font-black uppercase text-slate-950">
                    30-MENIT NON-STOP AUDIO AKTIF
                  </h4>
                </div>
                <p className="text-xs font-bold text-slate-800 mt-1">
                  ★ Putar musik panjang 30 menit tanpa gangguan jeda &amp; iklan. Kualitas jernih 320kbps.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAlertVisible(false)}
              aria-label="Tutup Pemberitahuan"
              className="p-1 rounded-lg hover:bg-black/10 text-slate-800 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* 2. Interactive Mood & Genre Quick Filter Badges */}
      <div className="neo-card p-4 sm:p-5 bg-white flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500">
              KATEGORI &amp; FILTER CEPAT
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              KLIK UNTUK PUTAR
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 mt-2">
            {/* 30 MIN NON-STOP */}
            <button
              onClick={() => onFilterGenre('30 min')}
              className="neo-sticker bg-[#86E3CE] text-slate-950 text-xs py-1.5 px-3 rotate-[-2deg] cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center gap-1 font-black"
            >
              <Clock size={12} />
              <span>30 MIN NON-STOP</span>
            </button>

            {/* POP HITS */}
            <button
              onClick={() => onFilterGenre('pop hits')}
              className="neo-sticker bg-[#6FE0C4] text-slate-950 text-xs py-1.5 px-3 rotate-[2deg] cursor-pointer hover:scale-105 active:scale-95 transition-transform font-black"
            >
              ★ POP HITS
            </button>

            {/* LOFI BEATS */}
            <button
              onClick={() => onFilterGenre('lofi beats')}
              className="neo-sticker bg-[#FFE853] text-slate-950 text-xs py-1.5 px-3 rotate-[-3deg] cursor-pointer hover:scale-105 active:scale-95 transition-transform font-black"
            >
              ● LO-FI CHILL
            </button>

            {/* TRENDING */}
            <button
              onClick={() => onFilterGenre('synthwave')}
              className="neo-sticker bg-[#C8C4FC] text-slate-950 text-xs py-1.5 px-3 rotate-[3deg] cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center gap-1 font-black"
            >
              <Flame size={12} className="text-[#2B50D9]" />
              <span>SYNTHWAVE</span>
            </button>

            {/* FAV */}
            <button
              onClick={() => setActiveView({ type: 'liked' })}
              className="neo-sticker bg-[#FF7E67] text-white text-xs py-1.5 px-3 rotate-[-2deg] cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center gap-1 font-black"
            >
              <Heart size={12} className="fill-white" />
              <span>FAVORIT</span>
            </button>

            {/* BUAT PLAYLIST */}
            <button
              onClick={onOpenCreatePlaylist}
              className="neo-sticker bg-[#2B50D9] text-white text-xs py-1.5 px-3 rotate-[1deg] cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center gap-1 font-black"
            >
              <Plus size={12} className="stroke-[3]" />
              <span>+ PLAYLIST</span>
            </button>
          </div>
        </div>

        {/* Clean status note */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
          <span className="flex items-center gap-1">
            <Radio size={13} className="text-[#2B50D9]" />
            Audio Streaming Terhubung
          </span>
          <span className="font-mono text-slate-400">v2.4 Live</span>
        </div>
      </div>
    </div>
  );
};
