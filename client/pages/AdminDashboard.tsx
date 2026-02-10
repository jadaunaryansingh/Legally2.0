import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BalanceScaleIcon from "@/components/BalanceScaleIcon";
import { 
  Users, 
  MessageSquare, 
  Activity, 
  TrendingUp, 
  LogOut,
  BarChart3,
  FileText
} from "lucide-react";

interface DashboardStats {
  total_users: number;
  total_queries: number;
  active_users_today: number;
  queries_today: number;
  top_categories: Array<{ category: string; count: number }>;
  last_updated: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      
      // Get admin token
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/login");
        return;
      }
      
      // Fetch stats from backend API instead of directly from Firebase
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBaseUrl}/api/v1/admin/dashboard?token=${token}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard stats from backend",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Logged Out",
      description: "Successfully logged out from admin panel",
    });
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white animate-pulse-scale">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background animated elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse-scale"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-scale" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl relative z-10 animate-fade-in">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BalanceScaleIcon className="w-10 h-10 text-white/80" />
            <div>
              <h1 className="text-2xl font-bold text-white animate-dancing-glow">Admin Dashboard</h1>
              <p className="text-sm text-white/60 animate-glow-text">Legal AI Management Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/users")}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/queries")}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Queries
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-white/30 text-white hover:border-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group relative border border-white/10 rounded-xl hover:border-white/40 transition-all duration-300 hover:bg-white/5 cursor-pointer active:scale-95 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20 overflow-hidden animate-slide-up bg-black/40 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70 group-hover:text-white transition-colors group-hover:animate-glow-text">Total Users</CardTitle>
              <Users className="h-5 w-5 text-white/60 group-hover:text-white transition-all animate-sparkling" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white animate-dancing-glow">{stats?.total_users || 0}</div>
              <p className="text-xs text-white/50 mt-1 group-hover:text-white/70 transition-colors">
                +{stats?.active_users_today || 0} active today
              </p>
            </CardContent>
          </Card>

          <Card className="group relative border border-white/10 rounded-xl hover:border-white/40 transition-all duration-300 hover:bg-white/5 cursor-pointer active:scale-95 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20 overflow-hidden animate-slide-up bg-black/40 backdrop-blur-xl" style={{ animationDelay: "0.1s" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70 group-hover:text-white transition-colors group-hover:animate-glow-text">Total Queries</CardTitle>
              <MessageSquare className="h-5 w-5 text-white/60 group-hover:text-white transition-all animate-sparkling" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white animate-dancing-glow">{stats?.total_queries || 0}</div>
              <p className="text-xs text-white/50 mt-1 group-hover:text-white/70 transition-colors">
                +{stats?.queries_today || 0} today
              </p>
            </CardContent>
          </Card>

          <Card className="group relative border border-white/10 rounded-xl hover:border-white/40 transition-all duration-300 hover:bg-white/5 cursor-pointer active:scale-95 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20 overflow-hidden animate-slide-up bg-black/40 backdrop-blur-xl" style={{ animationDelay: "0.2s" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70 group-hover:text-white transition-colors group-hover:animate-glow-text">Active Today</CardTitle>
              <Activity className="h-5 w-5 text-white/60 group-hover:text-white transition-all animate-sparkling" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white animate-dancing-glow">{stats?.active_users_today || 0}</div>
              <p className="text-xs text-white/50 mt-1 group-hover:text-white/70 transition-colors">Users online</p>
            </CardContent>
          </Card>

          <Card className="group relative border border-white/10 rounded-xl hover:border-white/40 transition-all duration-300 hover:bg-white/5 cursor-pointer active:scale-95 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20 overflow-hidden animate-slide-up bg-black/40 backdrop-blur-xl" style={{ animationDelay: "0.3s" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70 group-hover:text-white transition-colors group-hover:animate-glow-text">Today's Queries</CardTitle>
              <TrendingUp className="h-5 w-5 text-white/60 group-hover:text-white transition-all animate-sparkling" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white animate-dancing-glow">{stats?.queries_today || 0}</div>
              <p className="text-xs text-white/50 mt-1 group-hover:text-white/70 transition-colors">Questions asked</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Categories */}
        <Card className="group relative border border-white/10 rounded-xl hover:border-white/40 transition-all duration-300 overflow-hidden animate-slide-up bg-black/40 backdrop-blur-xl" style={{ animationDelay: "0.4s" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-white/80 animate-sparkling" />
              <CardTitle className="text-white animate-dancing-glow">Top Legal Categories</CardTitle>
            </div>
            <CardDescription className="text-white/60 animate-glow-text">
              Most queried legal topics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.top_categories?.map((category, index) => (
                <div key={index} className="flex items-center justify-between group/item hover:bg-white/5 p-3 rounded-lg transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-white/60 group-hover/item:text-white transition-all" />
                    <span className="text-white font-medium group-hover/item:animate-glow-text">{category.category}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-48 bg-white/10 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-1000 animate-shimmer"
                        style={{
                          width: `${(category.count / (stats.top_categories[0]?.count || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-white/70 text-sm font-mono w-16 text-right group-hover/item:text-white transition-colors">
                      {category.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
