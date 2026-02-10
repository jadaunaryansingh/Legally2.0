export default function BalanceScaleIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {/* Base */}
      <rect x="35" y="90" width="50" height="8" fill="currentColor" />

      {/* Center post */}
      <line x1="60" y1="90" x2="60" y2="25" strokeWidth="3" />

      {/* Left pan - oscillates */}
      <g className="animate-balance-left origin-[25px_30px]">
        {/* Left beam */}
        <line x1="30" y1="30" x2="60" y2="30" strokeWidth="2.5" />
        {/* Left pan */}
        <circle cx="30" cy="45" r="12" fill="none" strokeWidth="2" />
        {/* Left chain */}
        <line x1="30" y1="30" x2="30" y2="33" strokeWidth="2" />
      </g>

      {/* Right pan - oscillates opposite */}
      <g className="animate-balance-right origin-[90px_30px]">
        {/* Right beam */}
        <line x1="60" y1="30" x2="90" y2="30" strokeWidth="2.5" />
        {/* Right pan */}
        <circle cx="90" cy="45" r="12" fill="none" strokeWidth="2" />
        {/* Right chain */}
        <line x1="90" y1="30" x2="90" y2="33" strokeWidth="2" />
      </g>

      {/* Fulcrum */}
      <circle cx="60" cy="30" r="3" fill="currentColor" />

      {/* Glow effect */}
      <circle
        cx="60"
        cy="55"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.15"
        className="animate-glow-pulse"
      />
    </svg>
  );
}
