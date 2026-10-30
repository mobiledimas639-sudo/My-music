import React, { useState, useEffect } from 'react';
import { Moon, X, Clock, Check } from 'lucide-react';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSetting: number | 'end_of_track' | null;
  remainingSeconds: number | null;
  onSetTimer: (minutes: number | 'end_of_track' | null) => void;
  onCancelTimer: () => void;
}

const TIMER_STEPS = [5, 10, 15, 20, 30, 45, 60, 90, 120];

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isOpen,
  onClose,
  currentSetting,
  remainingSeconds,
  onSetTimer,
  onCancelTimer
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(() => {
    if (typeof currentSetting === 'number') return currentSetting;
    const saved = localStorage.getItem('aurora_default_sleep_timer');
    return saved ? parseInt(saved, 10) || 30 : 30;
  });

  const [mode, setMode] = useState<'minutes' | 'end_of_track'>(() => {
    return currentSetting === 'end_of_track' ? 'end_of_track' : 'minutes';
  });

  const [isDefaultSaved, setIsDefaultSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (typeof currentSetting === 'number') {
        setSelectedMinutes(currentSetting);
        setMode('minutes');
      } else if (currentSetting === 'end_of_track') {
        setMode('end_of_track');
      }
      setIsDefaultSaved(false);
    }
  }, [isOpen, currentSetting]);

  if (!isOpen) return null;

  const handleSaveDefault = () => {
    if (mode === 'minutes') {
      localStorage.setItem('aurora_default_sleep_timer', selectedMinutes.toString());
      setIsDefaultSaved(true);
      setTimeout(() => setIsDefaultSaved(false), 2000);
    }
  };

  const handleApply = () => {
    if (mode === 'end_of_track') {
      onSetTimer('end_of_track');
    } else {
      onSetTimer(selectedMinutes);
    }
    onClose();
  };

  const handleReset = () => {
    onCancelTimer();
    onClose();
  };

  // Find index in TIMER_STEPS for slider
  const sliderIndex = TIMER_STEPS.indexOf(selectedMinutes) !== -1 
    ? TIMER_STEPS.indexOf(selectedMinutes) 
    : 4; // default to 30

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    setSelectedMinutes(TIMER_STEPS[idx]);
    setMode('minutes');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      {/* Neo-Brutalist Sleep Timer Card */}
      <div 
        className="w-full max-w-sm bg-white rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_#18181b] p-6 space-y-6 relative overflow-hidden animate-pop-float"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE853] border-2 border-slate-900 shadow-[2px_2px_0px_#18181b] flex items-center justify-center">
              <Moon size={20} className="text-slate-950 fill-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-slate-950 tracking-tight">
                Waktu Tidur
              </h3>
              <p className="text-[11px] font-bold text-slate-500 font-mono">
                Hentikan musik otomatis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Duration Banner */}
        <div className="text-center py-4 bg-slate-50 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_#18181b]">
          <div className="text-3xl font-black text-slate-950 tracking-tight">
            {mode === 'end_of_track' ? (
              <span className="text-[#2B50D9]">Di Akhir Lagu</span>
            ) : (
              <span>{selectedMinutes} <span className="text-lg font-bold text-slate-500">menit</span></span>
            )}
          </div>

          {remainingSeconds !== null && currentSetting !== null && (
            <div className="mt-1 text-xs font-mono font-bold text-emerald-600 flex items-center justify-center gap-1">
              <Clock size={12} className="animate-spin" style={{ animationDuration: '4s' }} />
              <span>Aktif: {Math.floor(remainingSeconds / 60)}m {remainingSeconds % 60}s tersisa</span>
            </div>
          )}
        </div>

        {/* Slider Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500">
            <span>5m</span>
            <span>30m</span>
            <span>60m</span>
            <span>120m</span>
          </div>

          <input
            type="range"
            min={0}
            max={TIMER_STEPS.length - 1}
            step={1}
            value={sliderIndex}
            onChange={handleSliderChange}
            className="w-full neo-slider cursor-pointer"
          />

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {[15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  setSelectedMinutes(mins);
                  setMode('minutes');
                }}
                className={`text-xs font-bold font-mono px-3 py-1 rounded-xl border-2 transition-all ${
                  mode === 'minutes' && selectedMinutes === mins
                    ? 'bg-[#2B50D9] text-white border-slate-900 shadow-[2px_2px_0px_#18181b]'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Action pills: Jadikan Default & Akhir Lagu */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleSaveDefault}
            className={`py-2 px-3 rounded-xl border-2 border-slate-900 text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
              isDefaultSaved
                ? 'bg-emerald-400 text-slate-950 shadow-[2px_2px_0px_#18181b]'
                : 'bg-white hover:bg-slate-50 text-slate-800 shadow-[1.5px_1.5px_0px_#18181b]'
            }`}
          >
            {isDefaultSaved ? <Check size={14} /> : null}
            <span>{isDefaultSaved ? 'Tersimpan' : 'Jadikan Default'}</span>
          </button>

          <button
            onClick={() => setMode('end_of_track')}
            className={`py-2 px-3 rounded-xl border-2 border-slate-900 text-xs font-bold font-mono transition-all ${
              mode === 'end_of_track'
                ? 'bg-[#86E3CE] text-slate-950 shadow-[2px_2px_0px_#18181b]'
                : 'bg-white hover:bg-slate-50 text-slate-800 shadow-[1.5px_1.5px_0px_#18181b]'
            }`}
          >
            Akhir Lagu
          </button>
        </div>

        {/* Footer buttons: Atur Ulang, Batal, Oke */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100">
          <button
            onClick={handleReset}
            className="text-xs font-black uppercase text-slate-500 hover:text-red-600 transition-colors"
          >
            Atur Ulang
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-[#2B50D9] hover:bg-blue-700 text-white border-2 border-slate-900 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#18181b] active:scale-95 transition-all"
            >
              Oke
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
