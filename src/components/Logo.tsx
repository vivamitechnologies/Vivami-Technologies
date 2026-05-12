import React from 'react';

export const Logo = ({ className = "", light = false }: { className?: string, light?: boolean }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative w-14 h-12 shrink-0">
      <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform transition-transform duration-500 hover:scale-110">
        {/* Precise Geometric "V" Icon - Professional Enterprise Style */}
        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B4A8B" />
            <stop offset="100%" stopColor="#1F2E5A" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9CB64A" />
            <stop offset="100%" stopColor="#AACC44" />
          </linearGradient>
        </defs>
        
        {/* Left Side Facets - Sharp Corporate Blue */}
        <path d="M5 15L45 70L35 15H5Z" fill="url(#blueGrad)" />
        <path d="M18 15L45 70L40 15H18Z" fill="#1F2E5A" fillOpacity="0.8" />
        
        {/* Right Side Facets - Vibrant Tech Green */}
        <path d="M45 70L85 15H55L45 70Z" fill="url(#greenGrad)" />
        <path d="M45 70L85 15H70L45 70Z" fill="#9CB64A" fillOpacity="0.7" />
        
        {/* Depth and Sharp Edge Definition */}
        <path d="M45 70L52 15L58 35L45 70Z" fill="#000" fillOpacity="0.08" />
      </svg>
    </div>
    <div className="flex flex-col">
      <div className="flex items-baseline leading-none">
        <span className={`text-3xl lg:text-4xl font-display font-black tracking-[-0.04em] flex uppercase`}>
          <span className={light ? 'text-white' : 'text-[#0B4A8B]'}>VIVA</span>
          <span className="text-[#9CB64A]">MI</span>
        </span>
      </div>
      {/* Thin horizontal branding line matching the image reference */}
      <div className={`h-[1.5px] w-full mt-1.5 mb-1 ${light ? 'bg-white/40' : 'bg-[#0B4A8B]'}`}></div>
      <span className={`text-[9px] font-black tracking-[0.55em] uppercase leading-none ${light ? 'text-white/90' : 'text-[#0B4A8B]'}`}>
        Technologies
      </span>
    </div>
  </div>
);
