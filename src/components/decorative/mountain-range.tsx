export default function MountainRange({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 600 120"
        fill="none"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* Núi xa */}
        <path
          d="M0,120 L60,40 L120,60 L180,20 L250,50 L300,30 L350,55 L420,25 L480,45 L540,35 L600,50 L600,120 Z"
          fill="hsl(221 83% 53% / 0.03)"
        />
        {/* Núi gần */}
        <path
          d="M0,120 L80,65 L150,85 L220,50 L290,75 L370,45 L440,70 L510,55 L600,70 L600,120 Z"
          fill="hsl(142 76% 36% / 0.03)"
        />
        {/* Núi trung tâm */}
        <path
          d="M50,120 L150,55 L220,80 L300,40 L380,70 L460,50 L550,75 L600,85 L600,120 Z"
          fill="hsl(221 83% 53% / 0.025)"
        />
      </svg>
    </div>
  );
}
