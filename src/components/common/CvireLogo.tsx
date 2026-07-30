import React from 'react';

interface CvireLogoProps {
  className?: string;
  size?: number;
  showProBadge?: boolean;
}

export const CvireLogo: React.FC<CvireLogoProps> = ({ className = '', size = 32, showProBadge = true }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/20 p-1.5"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-white"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xl font-extrabold tracking-tight text-white font-sans flex items-center gap-1">
          cvire
        </span>
        {showProBadge && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30 shadow-sm">
            PRO
          </span>
        )}
      </div>
    </div>
  );
};
