import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Music2, Loader2, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { Track } from '../types/music';
import { fetchTrackLyrics, LyricLine } from '../services/lyricsService';
import { formatTime } from '../services/musicApi';

interface LyricsViewProps {
  track: Track;
  currentTime: number;
  onSeek: (time: number) => void;
  isPlaying: boolean;
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  track,
  currentTime,
  onSeek,
  isPlaying
}) => {
  const [lines, setLines] = useState<LyricLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<string>('');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const userScrollTimeoutRef = useRef<any>(null);

  // Load lyrics whenever current track changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    fetchTrackLyrics(track.title, track.artist, track.duration)
      .then((res) => {
        if (!isCancelled) {
          setLines(res.lines || []);
          setSource(res.source || 'synced');
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [track.id, track.title, track.artist, track.duration]);

  // Find active line index (triggers with exact vocal timing)
  const activeIndex = React.useMemo(() => {
    if (!lines || lines.length === 0) return -1;
    let idx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].time <= currentTime + 0.08) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [lines, currentTime]);

  // Smoothly center the active lyric element dead-center in the viewport
  const scrollToActiveElement = useCallback((smooth: boolean = true) => {
    const container = containerRef.current;
    if (!container || activeIndex === -1) return;

    const activeEl = container.querySelector(`[data-lyric-index="${activeIndex}"]`) as HTMLElement;
    if (!activeEl) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    // Exact delta needed to place the active line's center at the container's center
    const activeCenterOffset = (activeRect.top - containerRect.top) + (activeRect.height / 2);
    const containerCenter = containerRect.height / 2;
    const scrollDelta = activeCenterOffset - containerCenter;

    const targetScroll = container.scrollTop + scrollDelta;

    container.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: smooth ? 'smooth' : 'auto'
    });
  }, [activeIndex]);

  // Trigger smooth scroll-to-view whenever activeIndex changes
  useEffect(() => {
    if (!autoScroll || isUserInteracting || activeIndex === -1) return;

    const animFrame = requestAnimationFrame(() => {
      scrollToActiveElement(true);
    });

    return () => cancelAnimationFrame(animFrame);
  }, [activeIndex, autoScroll, isUserInteracting, scrollToActiveElement]);

  // Initial scroll when lines finish loading
  useEffect(() => {
    if (!isLoading && lines.length > 0 && activeIndex !== -1) {
      const timer = setTimeout(() => {
        scrollToActiveElement(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, lines.length, scrollToActiveElement]);

  // Handle user manual scroll: pause auto-scroll temporarily then resume
  const handleUserScroll = () => {
    if (!autoScroll) return;
    setIsUserInteracting(true);
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }
    // Resume auto-centering after 3.5 seconds of inactivity
    userScrollTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
      scrollToActiveElement(true);
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#FDFBF7] text-slate-900 rounded-3xl border-2 border-slate-900 overflow-hidden relative shadow-[4px_4px_0px_#18181b]">
      
      {/* Background Subtle Dot Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      />

      {/* Top Bar Controls */}
      <div className="relative z-10 p-2.5 sm:p-3 px-3.5 sm:px-6 bg-white border-b-2 border-slate-900 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="neo-sticker bg-[#FFE853] text-slate-950 text-[10px] sm:text-xs py-0.5 px-2.5 font-black rotate-[-2deg]">
            ♬ LIRIK SINKRON
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 hidden sm:inline">
            Ketuk baris lirik untuk melompat
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Recenter button if user scrolled away */}
          {isUserInteracting && (
            <button
              onClick={() => {
                setIsUserInteracting(false);
                scrollToActiveElement(true);
              }}
              title="Kembali ke Lirik Aktif"
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FFE853] text-slate-950 border-2 border-slate-900 text-[10px] font-black shadow-[1px_1px_0px_#18181b] animate-bounce"
            >
              <Compass size={12} />
              <span>Tengahkan</span>
            </button>
          )}

          {/* Font Size Toggle */}
          <button
            onClick={() => setFontSize(prev => prev === 'normal' ? 'large' : 'normal')}
            title="Ubah Ukuran Huruf"
            className="p-1 sm:p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            {fontSize === 'normal' ? <ZoomIn size={14} /> : <ZoomOut size={14} />}
          </button>

          {/* Auto Scroll Toggle */}
          <button
            onClick={() => {
              setAutoScroll(prev => !prev);
              if (!autoScroll) {
                setIsUserInteracting(false);
                scrollToActiveElement(true);
              }
            }}
            className={`text-[10px] sm:text-[11px] font-mono font-black px-2.5 py-1 rounded-xl border-2 border-slate-900 transition-all ${
              autoScroll 
                ? 'bg-[#86E3CE] text-slate-950 shadow-[1.5px_1.5px_0px_#18181b]' 
                : 'bg-white text-slate-500 hover:text-slate-900'
            }`}
          >
            {autoScroll ? 'Auto-Scroll ON' : 'Manual'}
          </button>
        </div>
      </div>

      {/* Lyrics Body with dynamic top/bottom padding for dead-center alignment */}
      <div 
        ref={containerRef}
        onWheel={handleUserScroll}
        onTouchMove={handleUserScroll}
        className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 space-y-4 sm:space-y-6"
        style={{
          paddingTop: 'calc(45% - 20px)',
          paddingBottom: 'calc(45% - 20px)'
        }}
      >
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#2B50D9] animate-spin" />
            <p className="text-xs font-black uppercase text-slate-600 font-mono tracking-wider">
              Menyelaraskan lirik dengan lagu...
            </p>
          </div>
        ) : lines.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 text-center">
            <Music2 className="w-10 h-10 text-slate-400" />
            <p className="text-sm font-bold text-slate-600">
              Lirik instrumental untuk {track.title}
            </p>
          </div>
        ) : (
          lines.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;

            return (
              <div
                key={`${line.time}-${idx}`}
                data-lyric-index={idx}
                onClick={() => {
                  onSeek(line.time);
                  setIsUserInteracting(false);
                }}
                className={`transition-all duration-300 cursor-pointer text-left select-none group ${
                  isActive
                    ? 'my-3 sm:my-4 origin-left'
                    : isPast
                    ? 'opacity-40 hover:opacity-80'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {isActive ? (
                  /* Active Magnified Karaoke Line with Neo-Brutalist Canary Yellow */
                  <div className="inline-block bg-[#FFE853] text-slate-950 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border-2 border-slate-900 shadow-[3.5px_3.5px_0px_#18181b] animate-pop-float max-w-full scale-[1.03] sm:scale-105 origin-left">
                    <span className={`block font-black tracking-tight leading-snug break-words ${
                      fontSize === 'large' ? 'text-xl sm:text-2xl' : 'text-base sm:text-xl'
                    }`}>
                      {line.text}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-800 mt-1 block">
                      ⏱ {formatTime(line.time)}
                    </span>
                  </div>
                ) : (
                  /* Standard Inactive Line */
                  <div className="py-1">
                    <span className={`font-bold text-slate-500 hover:text-slate-900 transition-colors block leading-relaxed break-words ${
                      fontSize === 'large' ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
                    }`}>
                      {line.text}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="relative z-10 p-2.5 px-4 sm:px-6 bg-white border-t-2 border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-600">
        <span className="truncate max-w-[200px] font-bold">{track.title} — {track.artist}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-900 font-black">Sinkron Real-Time</span>
        </div>
      </div>
    </div>
  );
};
