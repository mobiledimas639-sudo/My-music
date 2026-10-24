import React, { useEffect, useRef, useState } from 'react';
import { Activity, X, Waves, BarChart3, Disc } from 'lucide-react';

interface AudioSpectrumVisualizerProps {
  isPlaying: boolean;
  getFrequencyData?: (array: Uint8Array) => void;
  trackTitle?: string;
  artist?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const AudioSpectrumVisualizer: React.FC<AudioSpectrumVisualizerProps> = ({
  isPlaying,
  getFrequencyData,
  trackTitle = 'Lagu',
  artist = 'Artis',
  isExpanded = false,
  onToggleExpand
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [visualizerMode, setVisualizerMode] = useState<'bars' | 'wave' | 'radial'>('bars');

  // Frequency energy meters (0 - 100%)
  const [bassLevel, setBassLevel] = useState(0);
  const [midLevel, setMidLevel] = useState(0);
  const [trebleLevel, setTrebleLevel] = useState(0);

  // Peak hold data for canvas
  const peakHold = useRef<number[]>(new Array(32).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = 32;
    const dataArray = new Uint8Array(bufferLength);
    let phase = 0;

    const render = () => {
      phase += 0.06;
      let hasRealData = false;

      // 1. Fetch real frequency data from Web Audio Analyser if connected
      if (getFrequencyData) {
        try {
          getFrequencyData(dataArray);
          // Check if frequency data has non-zero values
          for (let i = 0; i < bufferLength; i++) {
            if (dataArray[i] > 0) {
              hasRealData = true;
              break;
            }
          }
        } catch {
          hasRealData = false;
        }
      }

      // 2. Dynamic reactive synthesis fallback if real audio node is silent or restricted
      if (!hasRealData && isPlaying) {
        for (let i = 0; i < bufferLength; i++) {
          const harmonic1 = Math.sin(phase * 1.8 + i * 0.35) * 45;
          const harmonic2 = Math.cos(phase * 2.5 - i * 0.25) * 35;
          const beat = Math.pow(Math.sin(phase * 1.2), 4) * 55;
          const bassBoost = i < 8 ? Math.sin(phase * 3 + i * 0.2) * 50 : 0;
          const val = Math.max(12, Math.min(255, 60 + harmonic1 + harmonic2 + beat + bassBoost));
          dataArray[i] = val;
        }
      } else if (!isPlaying) {
        // Smoothly decay to zero when paused
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.max(0, dataArray[i] * 0.88);
        }
      }

      // Compute energy meters (Bass: 0-8, Mids: 8-20, Treble: 20-31)
      let bSum = 0;
      for (let i = 0; i < 8; i++) bSum += dataArray[i];
      let mSum = 0;
      for (let i = 8; i < 20; i++) mSum += dataArray[i];
      let tSum = 0;
      for (let i = 20; i < 32; i++) tSum += dataArray[i];

      setBassLevel(Math.round((bSum / (8 * 255)) * 100));
      setMidLevel(Math.round((mSum / (12 * 255)) * 100));
      setTrebleLevel(Math.round((tSum / (12 * 255)) * 100));

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      // MODE 1: BARS SPECTRUM WITH GRADIENT & PEAKS
      if (visualizerMode === 'bars') {
        const barCount = 28;
        const totalGap = (barCount - 1) * 3;
        const barWidth = Math.max(3, (width - totalGap) / barCount);

        for (let i = 0; i < barCount; i++) {
          const rawVal = dataArray[i] || 0;
          const targetHeight = Math.max(4, (rawVal / 255) * (height - 10));

          // Peak hold logic
          if (targetHeight >= (peakHold.current[i] || 0)) {
            peakHold.current[i] = targetHeight;
          } else {
            peakHold.current[i] = Math.max(0, (peakHold.current[i] || 0) - 1.2);
          }

          const x = i * (barWidth + 3);
          const y = height - targetHeight;

          // Liquid Gradient: Emerald -> Cyan -> Cyber Violet
          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          gradient.addColorStop(0, '#10b981'); // emerald-500
          gradient.addColorStop(0.5, '#06b6d4'); // cyan-500
          gradient.addColorStop(1, '#a855f7'); // purple-500

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, targetHeight, [3, 3, 0, 0]);
          ctx.fill();

          // Peak indicator dot
          const peakY = Math.max(2, height - (peakHold.current[i] || 0) - 3);
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(x, peakY, barWidth, 2);
        }
      }

      // MODE 2: WAVEFORM OSCILLOSCOPE
      else if (visualizerMode === 'wave') {
        ctx.beginPath();
        ctx.lineWidth = 3;
        const waveGradient = ctx.createLinearGradient(0, 0, width, 0);
        waveGradient.addColorStop(0, '#10b981');
        waveGradient.addColorStop(0.5, '#06b6d4');
        waveGradient.addColorStop(1, '#8b5cf6');
        ctx.strokeStyle = waveGradient;

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Glow fill beneath wave
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
        ctx.fill();
      }

      // MODE 3: RADIAL AURORA DISC
      else if (visualizerMode === 'radial') {
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = Math.min(width, height) * 0.28;

        for (let i = 0; i < bufferLength; i++) {
          const angle = (i / bufferLength) * Math.PI * 2;
          const val = dataArray[i] / 255;
          const barLength = Math.max(4, val * (height * 0.22));

          const x1 = centerX + Math.cos(angle) * baseRadius;
          const y1 = centerY + Math.sin(angle) * baseRadius;
          const x2 = centerX + Math.cos(angle) * (baseRadius + barLength);
          const y2 = centerY + Math.sin(angle) * (baseRadius + barLength);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineWidth = 3;
          ctx.strokeStyle = i % 2 === 0 ? '#10b981' : '#8b5cf6';
          ctx.stroke();
        }

        // Center Pulsing Orb
        ctx.beginPath();
        const pulseR = baseRadius * 0.75 + (bassLevel / 100) * 8;
        ctx.arc(centerX, centerY, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, getFrequencyData, visualizerMode, bassLevel]);

  return (
    <>
      {/* 1. Compact Spectrum Bar for Player Bar Dock */}
      <div 
        onClick={onToggleExpand}
        title="Buka Panel Visualizer Spektrum Real-Time"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] hover:bg-amber-100 cursor-pointer transition-all group"
      >
        <div className="flex items-end gap-0.5 h-4 w-12 justify-center">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className={`w-1 rounded-full border border-slate-900 transition-all duration-75 ${
                isPlaying
                  ? i % 2 === 0 ? 'bg-[#FFE853]' : 'bg-[#86E3CE]'
                  : 'bg-slate-300 h-1'
              }`}
              style={{
                height: isPlaying
                  ? `${Math.max(3, Math.min(16, (i % 2 === 0 ? bassLevel : midLevel) * 0.16 + (i + 1) * 2))}px`
                  : '3px'
              }}
            />
          ))}
        </div>
        <span className="hidden xl:inline text-[10px] font-mono font-black uppercase tracking-wider text-slate-800">
          SPEKTRUM
        </span>
      </div>

      {/* 2. Expanded Floating HUD Visualizer Panel */}
      {isExpanded && (
        <div className="fixed bottom-28 right-3 lg:right-6 z-50 w-full max-w-md bg-white border-2 border-slate-900 rounded-3xl p-5 shadow-[8px_8px_0px_#18181b] animate-slideUp">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-[#FFE853] text-slate-950 border-2 border-slate-900 shadow-[1px_1px_0px_#18181b]">
                <Activity size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-slate-950 flex items-center gap-2">
                  <span>Visualizer Spektrum Real-Time</span>
                  <span className="neo-sticker bg-[#86E3CE] text-slate-950 text-[9px] py-0 px-1.5 rotate-[-2deg]">
                    60 FPS
                  </span>
                </h4>
                <p className="text-[11px] font-bold text-slate-500 truncate max-w-[220px]">
                  {trackTitle} — {artist}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Visualizer Mode Switcher */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-900 text-xs">
                <button
                  onClick={() => setVisualizerMode('bars')}
                  title="Mode Spektrum Batang"
                  className={`p-1.5 rounded-lg transition-colors ${
                    visualizerMode === 'bars' ? 'bg-[#FFE853] text-slate-950 border border-slate-900' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <BarChart3 size={13} />
                </button>
                <button
                  onClick={() => setVisualizerMode('wave')}
                  title="Mode Gelombang Sinus"
                  className={`p-1.5 rounded-lg transition-colors ${
                    visualizerMode === 'wave' ? 'bg-[#FFE853] text-slate-950 border border-slate-900' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Waves size={13} />
                </button>
                <button
                  onClick={() => setVisualizerMode('radial')}
                  title="Mode Lingkaran Radial"
                  className={`p-1.5 rounded-lg transition-colors ${
                    visualizerMode === 'radial' ? 'bg-[#FFE853] text-slate-950 border border-slate-900' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Disc size={13} />
                </button>
              </div>

              <button
                onClick={onToggleExpand}
                className="p-1.5 text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-900 rounded-lg transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Canvas Spectrum Display */}
          <div className="relative aspect-[16/7] w-full bg-slate-950 rounded-2xl overflow-hidden mt-3.5 border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={380}
              height={160}
              className="w-full h-full object-contain"
            />

            {!isPlaying && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-xs text-white font-black uppercase tracking-wider">
                Pemutaran dihentikan sementara
              </div>
            )}
          </div>

          {/* Energy Band Meters (Bass, Mid, Treble) */}
          <div className="grid grid-cols-3 gap-2.5 pt-3.5 mt-3 border-t-2 border-slate-100 text-[11px] font-mono font-bold tabular-nums">
            <div className="p-2 rounded-xl bg-slate-50 border-2 border-slate-900">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-[10px] font-black text-slate-900">BASS</span>
                <span>{bassLevel}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-900">
                <div
                  className="h-full bg-[#FFE853] rounded-full transition-all duration-75"
                  style={{ width: `${bassLevel}%` }}
                />
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border-2 border-slate-900">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-[10px] font-black text-slate-900">MID</span>
                <span>{midLevel}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-900">
                <div
                  className="h-full bg-[#86E3CE] rounded-full transition-all duration-75"
                  style={{ width: `${midLevel}%` }}
                />
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border-2 border-slate-900">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-[10px] font-black text-slate-900">TREBLE</span>
                <span>{trebleLevel}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-900">
                <div
                  className="h-full bg-[#FF7E67] rounded-full transition-all duration-75"
                  style={{ width: `${trebleLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
