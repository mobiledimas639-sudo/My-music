import React from 'react';

export const MemphisBackdrop: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Subtle Dotted Matrix Pattern */}
      <div className="absolute inset-0 bg-memphis-dots pointer-events-none" />

      {/* Mint Circle Accent (Top-Left) */}
      <div 
        className="absolute -top-24 -left-20 w-[420px] h-[420px] rounded-full opacity-35"
        style={{
          background: 'radial-gradient(circle, #86e3ce 0%, rgba(134, 227, 206, 0.1) 70%, transparent 100%)',
          filter: 'blur(40px)'
        }}
      />

      {/* Coral/Peach Curved Accent (Top-Right / Center) */}
      <div 
        className="absolute top-1/4 -right-28 w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, #ffb4a2 0%, rgba(255, 180, 162, 0.1) 70%, transparent 100%)',
          filter: 'blur(50px)'
        }}
      />

      {/* Soft Lavender Accent (Bottom-Left) */}
      <div 
        className="absolute -bottom-32 left-1/4 w-[480px] h-[480px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, #c8c4fc 0%, rgba(200, 196, 252, 0.08) 70%, transparent 100%)',
          filter: 'blur(45px)'
        }}
      />

      {/* Decorative Geometric Deco Shapes (Crisp Memphis touches) */}
      <svg 
        className="absolute top-20 right-12 w-24 h-24 text-slate-800/10 pointer-events-none hidden xl:block"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <circle cx="50" cy="50" r="38" strokeDasharray="6 6" />
        <path d="M50 20 L50 80 M20 50 L80 50" />
      </svg>

      <svg 
        className="absolute bottom-28 left-8 w-20 h-20 text-slate-800/10 pointer-events-none hidden xl:block"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <polygon points="50,15 90,85 10,85" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
};
