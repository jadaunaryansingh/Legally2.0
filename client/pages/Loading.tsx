import { useEffect, useState } from "react";

export default function Loading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="text-center">
        {/* Balance Scale Animation */}
        <div className="mb-12 flex items-center justify-center">
          <div className="animate-glow-scale">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              className="text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {/* Scale base */}
              <rect x="30" y="80" width="60" height="8" fill="currentColor" />

              {/* Center post */}
              <line x1="60" y1="80" x2="60" y2="20" strokeWidth="2" />

              {/* Horizontal beam */}
              <line x1="25" y1="25" x2="95" y2="25" strokeWidth="2" />

              {/* Left pan */}
              <circle cx="35" cy="45" r="12" fill="none" strokeWidth="1.5" />
              <line x1="35" y1="25" x2="35" y2="33" strokeWidth="1.5" />

              {/* Right pan */}
              <circle cx="85" cy="45" r="12" fill="none" strokeWidth="1.5" />
              <line x1="85" y1="25" x2="85" y2="33" strokeWidth="1.5" />

              {/* Fulcrum triangle */}
              <path d="M 55 75 L 65 75 L 60 80 Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Justice. Clarity. Intelligence.
        </h1>
      </div>
    </div>
  );
}
