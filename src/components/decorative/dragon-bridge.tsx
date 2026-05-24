export default function DragonBridge({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 400 160"
        fill="none"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* Thân rồng lượn sóng */}
        <path
          d="M0,140 C20,130 40,110 60,120 C80,130 100,100 120,105 C140,110 160,80 180,85 C200,90 220,60 240,65 C260,70 280,45 300,50 C320,55 340,30 360,35 C380,40 390,20 400,25"
          stroke="hsl(var(--primary) / 0.12)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Đầu rồng */}
        <path
          d="M390,20 C395,15 398,10 400,8 C398,5 395,3 390,5 C388,7 385,12 385,15"
          fill="hsl(var(--primary) / 0.12)"
        />
        {/* Chân rồng */}
        <line x1="120" y1="105" x2="115" y2="135" stroke="hsl(var(--primary) / 0.08)" strokeWidth="2" />
        <line x1="240" y1="65" x2="245" y2="95" stroke="hsl(var(--primary) / 0.08)" strokeWidth="2" />
        <line x1="360" y1="35" x2="355" y2="65" stroke="hsl(var(--primary) / 0.08)" strokeWidth="2" />
      </svg>
    </div>
  );
}
