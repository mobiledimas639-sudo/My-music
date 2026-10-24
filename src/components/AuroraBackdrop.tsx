import React from 'react';

interface AuroraBackdropProps {
  isPlaying: boolean;
}

export const AuroraBackdrop: React.FC<AuroraBackdropProps> = ({ isPlaying }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#030712]">
      {/* Aurora Ambient Orb 1 - Emerald */}
      <div 
        className={`absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[130px] opacity-25 bg-emerald-500 transition-all duration-1000 ${
          isPlaying ? 'scale-110 opacity-35 animate-aurora-1' : 'scale-100'
        }`}
      />

      {/* Aurora Ambient Orb 2 - Violet / Indigo */}
      <div 
        className={`absolute top-1/4 -right-40 w-[700px] h-[700px] rounded-full blur-[140px] opacity-25 bg-violet-600 transition-all duration-1000 ${
          isPlaying ? 'scale-115 opacity-40 animate-aurora-2' : 'scale-100'
        }`}
      />

      {/* Aurora Ambient Orb 3 - Cyan / Teal */}
      <div 
        className={`absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 bg-teal-500 transition-all duration-1000 ${
          isPlaying ? 'scale-105 opacity-30' : 'scale-95'
        }`}
      />

      {/* Subtle Noise / Vignette Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(3,7,18,0.7)_100%)]" />
    </div>
  );
};
