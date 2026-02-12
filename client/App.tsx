import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChangedWithAuth } from "@/services/firebase";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Laws from "./pages/Laws";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminQueries from "./pages/AdminQueries";
import AdminUserDetails from "./pages/AdminUserDetails";
import BalanceScaleLoader from "./components/BalanceScaleLoader";

const queryClient = new QueryClient();

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash only on first visit
    const hasVisited = localStorage.getItem("hasVisited");
    return !hasVisited;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        localStorage.setItem("hasVisited", "true");
        setShowSplash(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChangedWithAuth((user) => {
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", user.email || "");
        localStorage.setItem("userId", user.uid);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
      }
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Wake up backend server on app load (Render free tier spins down when inactive)
  useEffect(() => {
    const wakeUpBackend = async () => {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      try {
        console.log('Waking up backend server...');
        // Ping health endpoint to wake up Render backend
        await fetch(`${apiBaseUrl}/api/v1/admin/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(30000), // 30s timeout for cold start
        });
        console.log('Backend server is ready!');
      } catch (error) {
        // Silently fail - backend will wake up on first actual API call
        console.log('Backend wake-up ping completed');
      }
    };

    wakeUpBackend();
  }, []);

  return (
    <>
      {showSplash && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] overflow-hidden">
          {/* Background Image with fade effect */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-fade-out"
            style={{
              backgroundImage:
                "url('https://cdn.builder.io/api/v1/image/assets%2Fdfdd342011694fdf947ffd27b7b5f027%2F61d194fe0e154e38ad1cdd5fbde34d02?format=webp&width=800')",
              backgroundColor: "#000",
              backgroundBlendMode: "overlay",
            }}
          ></div>

          {/* Dark overlay for better visibility of loader */}
          <div className="absolute inset-0 bg-black/40 animate-fade-out"></div>

          {/* Loader on top */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-6 animate-fade-in">
            <BalanceScaleLoader />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2 animate-dancing-glow">
                Justice. Clarity. Intelligence.
              </h2>
              <p className="text-white/60 text-sm animate-glow-text">
                Initializing AI Legal Assistant...
              </p>
            </div>
          </div>
        </div>
      )}
      {!showSplash && isCheckingAuth && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
          <div className="flex flex-col items-center justify-center gap-6">
            <BalanceScaleLoader />
            <p className="text-white/60 text-sm animate-glow-text">
              Verifying authentication...
            </p>
          </div>
        </div>
      )}
      {!showSplash && !isCheckingAuth && (
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Index />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/chat"
              element={
                isAuthenticated ? (
                  <Chat />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/laws"
              element={
                isAuthenticated ? (
                  <Laws />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:userId" element={<AdminUserDetails />} />
            <Route path="/admin/queries" element={<AdminQueries />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
