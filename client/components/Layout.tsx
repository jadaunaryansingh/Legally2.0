import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { firebaseSignOut, auth } from "@/services/firebase";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse" style={{ transform: "translateX(-50%)", animationDuration: "4s" }}></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/10 relative z-10 backdrop-blur-sm bg-black/50">
        <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group">
              {/* Logo */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 120 120"
                className="text-white flex-shrink-0 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 group-hover:drop-shadow-lg group-hover:drop-shadow-white/30 animate-sparkling"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {/* Scale base */}
                <rect x="30" y="80" width="60" height="8" fill="currentColor" />

                {/* Center post */}
                <line x1="60" y1="80" x2="60" y2="20" strokeWidth="2" />

                {/* Horizontal beam */}
                <line x1="25" y1="25" x2="95" y2="25" strokeWidth="2" />

                {/* Left pan */}
                <circle cx="35" cy="45" r="12" fill="none" strokeWidth="2" />
                <line x1="35" y1="25" x2="35" y2="33" strokeWidth="2" />

                {/* Right pan */}
                <circle cx="85" cy="45" r="12" fill="none" strokeWidth="2" />
                <line x1="85" y1="25" x2="85" y2="33" strokeWidth="2" />

                {/* Fulcrum triangle */}
                <path d="M 55 75 L 65 75 L 60 80 Z" fill="currentColor" />
              </svg>

              {/* Website Name */}
              <Link
                to="/"
                className="text-3xl font-bold tracking-tight hover:opacity-80 transition-opacity transform group-hover:scale-110 duration-300 group-hover:animate-dancing-glow"
              >
                Legally
              </Link>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              <Link
                to="/chat"
                className="group/btn relative px-4 py-2 text-white/70 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-110"
              >
                Chat
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover/btn:w-full transition-all duration-300"></span>
              </Link>
              <button
                onClick={async () => {
                  try {
                    await firebaseSignOut(auth);
                    localStorage.removeItem("isAuthenticated");
                    localStorage.removeItem("userEmail");
                    localStorage.removeItem("userId");
                    window.location.href = "/login";
                  } catch (error) {
                    console.error("Error signing out:", error);
                  }
                }}
                className="group/btn relative px-4 py-2 text-white/70 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-110"
              >
                Logout
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover/btn:w-full transition-all duration-300"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 backdrop-blur-sm bg-black/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Links */}
            <div className="flex items-center gap-8 text-sm text-white/70">
              <a
                href="#about"
                className="hover:text-white transition-colors duration-300 relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#disclaimer"
                className="hover:text-white transition-colors duration-300 relative group"
              >
                Disclaimer
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#privacy"
                className="hover:text-white transition-colors duration-300 relative group"
              >
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-white/50 animate-glow-text">
              ⚖️ Powered by AI. Built for legal clarity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
