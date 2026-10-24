import React, { useState } from 'react';
import { X, Youtube, ExternalLink, Copy, Check, Music2, AlertCircle } from 'lucide-react';
import { Track } from '../types/music';

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
}

export const YouTubeModal: React.FC<YouTubeModalProps> = ({
  isOpen,
  onClose,
  track
}) => {
  const [copied, setCopied] = useState(false);
  const [hasIFrameIssue, setHasIFrameIssue] = useState(false);

  if (!isOpen || !track) return null;

  const searchQuery = encodeURIComponent(`${track.artist} - ${track.title} official audio`);
  const embedUrl = track.videoId 
    ? `https://www.youtube-nocookie.com/embed/${track.videoId}?autoplay=1&enablejsapi=1`
    : `https://www.youtube-nocookie.com/embed?listType=search&list=${searchQuery}&autoplay=1`;
  const directWatchUrl = track.videoId
    ? `https://www.youtube.com/watch?v=${track.videoId}`
    : `https://www.youtube.com/results?search_query=${searchQuery}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directWatchUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl neo-card bg-white p-0 overflow-hidden shadow-[8px_8px_0px_#18181b] flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b-2 border-slate-900 bg-[#FFE853]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white text-red-600 border-2 border-slate-900 shadow-[1px_1px_0px_#18181b]">
              <Youtube size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black uppercase text-slate-950 flex items-center gap-2">
                <span>Player YouTube Music</span>
                <span className="neo-sticker bg-[#86E3CE] text-slate-950 text-[9px] py-0 px-1.5 rotate-[-2deg]">
                  FULL AUDIO
                </span>
              </h3>
              <p className="text-xs font-bold text-slate-700 truncate max-w-sm">
                {track.title} — {track.artist}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Salin Link YouTube"
              className="p-2 text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-900 transition-colors"
            >
              {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            </button>

            <a
              href={directWatchUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 rounded-xl font-black uppercase tracking-wider neo-btn"
            >
              <ExternalLink size={13} />
              <span>Buka YouTube</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-900 bg-white border border-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Video Frame */}
        <div className="relative aspect-video w-full bg-slate-950 flex flex-col items-center justify-center">
          <iframe
            src={embedUrl}
            title={`${track.artist} - ${track.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
            onError={() => setHasIFrameIssue(true)}
          />

          {hasIFrameIssue && (
            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center space-y-3">
              <AlertCircle size={32} className="text-red-500" />
              <p className="text-sm font-black uppercase text-slate-950">Video Dibatasi Pemilik Hak Cipta</p>
              <p className="text-xs text-slate-600 max-w-md">
                Sebagian video musik di YouTube membatasi embed langsung. Anda dapat membukanya secara instan di web YouTube.
              </p>
              <a
                href={directWatchUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-wider neo-btn"
              >
                Buka di YouTube Sekarang
              </a>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 px-6 bg-slate-50 border-t-2 border-slate-900 flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <Music2 size={14} className="text-[#2B50D9]" />
            <span>Streaming sinkron audio tanpa potongan</span>
          </div>
          <span className="font-mono text-slate-500">100% Full Playback</span>
        </div>
      </div>
    </div>
  );
};
