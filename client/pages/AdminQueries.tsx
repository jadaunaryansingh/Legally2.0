import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import BalanceScaleIcon from "@/components/BalanceScaleIcon";
import { 
  MessageSquare, 
  LogOut,
  Search,
  ArrowLeft,
  Clock,
  User,
  Filter
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ChatQuery {
  id?: string;
  userId: string;
  userEmail: string;
  message: string;
  response: string;
  timestamp: number;
  category?: string;
}

export default function AdminQueries() {
  const [queries, setQueries] = useState<ChatQuery[]>([]);
  const [totalQueries, setTotalQueries] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = ["Criminal Law", "Civil Rights", "Corporate Law", "Family Law", "Tax Law"];

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchQueries();
  }, [navigate, selectedCategory]);

  const fetchQueries = async () => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBaseUrl}/api/v1/admin/queries?token=${token}`);
      if (!response.ok) {
        throw new Error("Failed to fetch queries");
      }
      
      const data = await response.json();
      
      // Convert backend response to frontend format
      const queriesData = data.queries.map((q: any) => ({
        id: q.timestamp,
        userId: q.user_id,
        userEmail: q.user_id,
        message: q.query,
        response: "",
        timestamp: typeof q.timestamp === 'string' ? Date.parse(q.timestamp) : q.timestamp,
        category: q.category || "General"
      }));
      
      // Filter by category if selected
      const filteredQueries = selectedCategory 
        ? queriesData.filter((chat: ChatQuery) => chat.category === selectedCategory)
        : queriesData;
      
      setQueries(filteredQueries);
      setTotalQueries(data.total);
    } catch (error) {
      console.error("Fetch queries error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch queries from backend",
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
    navigate("/login");
  };

  const filteredQueries = queries.filter(query => 
    query.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    query.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    query.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      "Criminal Law": "bg-red-500/20 text-red-200 border-red-500/30 hover:bg-red-500/30 transition-all duration-300",
      "Civil Rights": "bg-blue-500/20 text-blue-200 border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300",
      "Corporate Law": "bg-green-500/20 text-green-200 border-green-500/30 hover:bg-green-500/30 transition-all duration-300",
      "Family Law": "bg-pink-500/20 text-pink-200 border-pink-500/30 hover:bg-pink-500/30 transition-all duration-300",
      "Tax Law": "bg-yellow-500/20 text-yellow-200 border-yellow-500/30 hover:bg-yellow-500/30 transition-all duration-300",
    };
    return colors[category || ""] || "bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300";
  };

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
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/dashboard")}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <BalanceScaleIcon className="w-10 h-10 text-white/80" />
            <div>
              <h1 className="text-2xl font-bold text-white animate-dancing-glow">Queries Management</h1>
              <p className="text-sm text-white/60 animate-glow-text">{totalQueries} total queries</p>
            </div>
          </div>
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Card className="group relative border border-white/10 rounded-xl hover:border-white/40 transition-all duration-300 overflow-hidden animate-slide-up bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-white flex items-center gap-2 animate-dancing-glow">
                  <MessageSquare className="w-5 h-5 text-white/80 animate-sparkling" />
                  All Queries
                </CardTitle>
                <CardDescription className="text-white/60 animate-glow-text">
                  View and filter user queries
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  placeholder="Search queries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/30 text-white placeholder:text-white/50 focus:border-white transition-all duration-300"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-white/60" />
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null 
                  ? "bg-white text-black hover:bg-white/90 transition-all duration-300 transform hover:scale-110 active:scale-95" 
                  : "border-white/30 text-white/70 hover:bg-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95"
                }
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-white text-black hover:bg-white/90 transition-all duration-300 transform hover:scale-110 active:scale-95" 
                    : "border-white/30 text-white/70 hover:bg-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-white/70 animate-pulse-scale">Loading queries...</div>
            ) : (
              <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-white/70">User</TableHead>
                      <TableHead className="text-white/70">Query</TableHead>
                      <TableHead className="text-white/70">Response</TableHead>
                      <TableHead className="text-white/70">Category</TableHead>
                      <TableHead className="text-white/70">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQueries.map((query, index) => (
                      <TableRow key={query.id || index} className="border-white/10 hover:bg-white/5 transition-all duration-300">
                        <TableCell className="text-white/70">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-white/60" />
                              <span className="text-sm">{query.userEmail}</span>
                            </div>
                            <span className="font-mono text-xs text-white/40">{query.userId.substring(0, 12)}...</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white max-w-md">
                          <p className="truncate text-sm">{query.message}</p>
                        </TableCell>
                        <TableCell className="text-white/70 max-w-lg">
                          <p className="truncate text-sm">{query.response.substring(0, 100)}...</p>
                        </TableCell>
                        <TableCell>
                          {query.category && (
                            <Badge className={getCategoryColor(query.category)}>
                              {query.category}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-white/70">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-white/60" />
                            {new Date(query.timestamp).toLocaleString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
