'use client';

export default function DecorativeGrid({ className = '' }: { className?: string }) {
  return (
    <div className={`fixed inset-0 pointer-events-none select-none z-0 overflow-hidden ${className}`}>
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="mesh-grid"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            {/* Grid lines */}
            <line x1="0" y1="0" x2="60" y2="0" stroke="hsl(221 83% 53% / 0.03)" strokeWidth="0.5" />
            <line x1="0" y1="0" x2="0" y2="60" stroke="hsl(221 83% 53% / 0.03)" strokeWidth="0.5" />
            {/* Intersection dot */}
            <circle cx="0" cy="0" r="1" fill="hsl(221 83% 53% / 0.05)" />
          </pattern>
          <radialGradient id="grid-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="grid-mask">
            <rect width="100%" height="100%" fill="url(#grid-fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#mesh-grid)" mask="url(#grid-mask)" />
      </svg>
    </div>
  );
}
