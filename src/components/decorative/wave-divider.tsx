export default function WaveDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${className}`}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[60px] md:h-[80px]">
        <path
          d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,80 L0,80 Z"
          fill="hsl(var(--primary) / 0.04)"
        />
      </svg>
    </div>
  );
}
