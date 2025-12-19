export default function BalanceScaleLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className="text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {/* Base */}
        <rect x="30" y="85" width="60" height="10" fill="currentColor" />

        {/* Center post */}
        <line x1="60" y1="85" x2="60" y2="15" strokeWidth="2" />

        {/* Left pan - oscillates */}
        <g className="animate-balance-left">
          {/* Left beam */}
          <line x1="25" y1="25" x2="60" y2="25" strokeWidth="2" />
          {/* Left pan */}
          <circle cx="25" cy="45" r="14" fill="none" strokeWidth="1.5" />
          {/* Left chain */}
          <line x1="25" y1="25" x2="25" y2="31" strokeWidth="1.5" />
        </g>

        {/* Right pan - oscillates opposite */}
        <g className="animate-balance-right">
          {/* Right beam */}
          <line x1="60" y1="25" x2="95" y2="25" strokeWidth="2" />
          {/* Right pan */}
          <circle cx="95" cy="45" r="14" fill="none" strokeWidth="1.5" />
          {/* Right chain */}
          <line x1="95" y1="25" x2="95" y2="31" strokeWidth="1.5" />
        </g>

        {/* Fulcrum triangle */}
        <path d="M 55 80 L 65 80 L 60 85 Z" fill="currentColor" />

        {/* Glow effect - animated */}
        <circle
          cx="60"
          cy="50"
          r="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.2"
          className="animate-glow-pulse"
        />
      </svg>

      {/* Loading text */}
      <div className="text-center">
        <p className="text-white text-sm tracking-wide">Justice. Clarity. Intelligence.</p>
      </div>
    </div>
  );
}
