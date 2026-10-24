import React, { useState, useEffect } from 'react';
import { X, Music, Check } from 'lucide-react';
import { Playlist } from '../types/music';
import { GRADIENT_OPTIONS } from '../hooks/useMusicStorage';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string, gradient: string) => void;
  playlistToEdit?: Playlist | null;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  playlistToEdit
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_OPTIONS[0].value);

  useEffect(() => {
    if (playlistToEdit) {
      setName(playlistToEdit.name);
      setDescription(playlistToEdit.description);
      setSelectedGradient(playlistToEdit.coverGradient || GRADIENT_OPTIONS[0].value);
    } else {
      setName('');
      setDescription('');
      setSelectedGradient(GRADIENT_OPTIONS[Math.floor(Math.random() * GRADIENT_OPTIONS.length)].value);
    }
  }, [playlistToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim(), description.trim(), selectedGradient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-md neo-card bg-white p-0 overflow-hidden shadow-[8px_8px_0px_#18181b]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b-2 border-slate-900 bg-[#FFE853]">
          <h3 className="text-sm font-black uppercase text-slate-950">
            {playlistToEdit ? 'Ubah Rincian Playlist' : 'Buat Playlist Kustom Baru'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-900 bg-white border border-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Live Cover Preview */}
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedGradient} flex items-center justify-center border-2 border-slate-900 shadow-[3px_3px_0px_#18181b] shrink-0`}>
              <Music size={32} className="text-slate-950" />
            </div>
            <div className="text-xs text-slate-600">
              <span className="font-black uppercase text-slate-900">Tema Warna Cover</span>
              <p className="mt-0.5">Pilih warna pop art untuk sampul playlist kustommu.</p>
            </div>
          </div>

          {/* Gradient Choices */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-700 mb-2">
              Pilihan Warna
            </label>
            <div className="grid grid-cols-6 gap-2">
              {GRADIENT_OPTIONS.map((grad) => (
                <button
                  type="button"
                  key={grad.id}
                  onClick={() => setSelectedGradient(grad.value)}
                  title={grad.label}
                  className={`h-9 rounded-xl bg-gradient-to-br ${grad.value} border-2 border-slate-900 flex items-center justify-center transition-all ${
                    selectedGradient === grad.value 
                      ? 'scale-110 shadow-[2px_2px_0px_#18181b]' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {selectedGradient === grad.value && <Check size={14} className="text-slate-950 stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
              Nama Playlist <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Summer Vibes 2024..."
              className="w-full px-3.5 py-2.5 text-xs md:text-sm font-bold bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 placeholder-slate-400 focus:outline-none focus:shadow-[3px_3px_0px_#18181b]"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
              Deskripsi
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan singkat tentang vibe playlist ini..."
              className="w-full p-3 text-xs font-bold bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-950 placeholder-slate-400 focus:outline-none focus:shadow-[3px_3px_0px_#18181b] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-[#2B50D9] neo-btn rounded-xl disabled:opacity-50"
            >
              {playlistToEdit ? 'Simpan' : 'Buat Playlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
