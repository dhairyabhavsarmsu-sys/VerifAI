import React from 'react';

interface VerifAILogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const VerifAILogo: React.FC<VerifAILogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const shieldDimensions = {
    sm: { width: 32, height: 36, textClass: 'text-lg', subClass: 'text-[9px]' },
    md: { width: 44, height: 50, textClass: 'text-2xl', subClass: 'text-[10px]' },
    lg: { width: 60, height: 68, textClass: 'text-3xl', subClass: 'text-xs' },
  }[size];

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Glowing Shield Logo SVG based on provided image */}
      <div className="relative flex-shrink-0 group">
        {/* Ambient Blur Glow behind shield */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600/50 via-indigo-500/40 to-cyan-400/50 blur-md opacity-80 group-hover:opacity-100 transition-opacity" />

        <svg
          width={shieldDimensions.width}
          height={shieldDimensions.height}
          viewBox="0 0 100 115"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-[0_4px_12px_rgba(37,99,235,0.4)]"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="45%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="60%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>

            <linearGradient id="innerGlow" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.8" />
            </linearGradient>

            <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Shield Shell */}
          <path
            d="M50 4L12 18V56C12 85 28 102 50 111C72 102 88 85 88 56V18L50 4Z"
            fill="url(#innerGlow)"
            stroke="url(#shieldGrad)"
            strokeWidth="6"
            strokeLinejoin="round"
          />

          {/* Inner Inset Bevel Line */}
          <path
            d="M50 14L22 25V56C22 79 34 93 50 100C66 93 78 79 78 56V25L50 14Z"
            stroke="url(#shieldGrad)"
            strokeWidth="1.8"
            strokeOpacity="0.6"
            fill="none"
          />

          {/* Glowing Checkmark in Center */}
          <path
            d="M32 54L45 67L71 39"
            stroke="url(#checkGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#shieldGlow)"
          />

          {/* Inner Tactical Reticle Dots */}
          <circle cx="50" cy="20" r="2" fill="#38BDF8" />
          <circle cx="50" cy="94" r="2" fill="#38BDF8" />
          <circle cx="26" cy="56" r="2" fill="#818CF8" />
          <circle cx="74" cy="56" r="2" fill="#818CF8" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center tracking-tight">
          <span className={`font-bold text-white tracking-normal font-display ${shieldDimensions.textClass}`}>
            Verif
          </span>
          <span
            className={`font-black font-display bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(6,182,212,0.35)] ${shieldDimensions.textClass}`}
          >
            AI
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`font-mono font-semibold tracking-[0.22em] text-cyan-400/90 uppercase ${shieldDimensions.subClass}`}
            >
              VERIFY
            </span>
            <span className="w-1 h-1 rounded-full bg-indigo-400/70" />
            <span
              className={`font-mono font-semibold tracking-[0.22em] text-indigo-300/90 uppercase ${shieldDimensions.subClass}`}
            >
              SECURE
            </span>
            <span className="w-1 h-1 rounded-full bg-cyan-400/70" />
            <span
              className={`font-mono font-semibold tracking-[0.22em] text-cyan-300/90 uppercase ${shieldDimensions.subClass}`}
            >
              TRUST
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
