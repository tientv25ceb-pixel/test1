export default function WaveBackground({ className = '', opacity = 0.04 }: { className?: string; opacity?: number }) {
  return (
    <div className={`w-full overflow-hidden leading-[0] pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className="w-full h-[120px] md:h-[200px]"
      >
        <path
          d="M0,100 C240,40 480,160 720,100 C960,40 1200,160 1440,100 L1440,200 L0,200 Z"
          fill={`hsl(var(--primary) / ${opacity})`}
        />
        <path
          d="M0,130 C240,70 480,190 720,130 C960,70 1200,190 1440,130 L1440,200 L0,200 Z"
          fill={`hsl(142 76% 36% / ${opacity * 0.7})`}
        />
      </svg>
    </div>
  );
}
