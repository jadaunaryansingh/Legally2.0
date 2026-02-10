import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import BalanceScaleIcon from "@/components/BalanceScaleIcon";
import { 
  Users, 
  LogOut,
  Search,
  Mail,
  Phone,
  Calendar,
  ArrowLeft
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserData {
  uid: string;
  email: string;
  phone?: string;
  createdAt: number;
  lastLogin?: number;
  displayName?: string;
  photoURL?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBaseUrl}/api/v1/admin/users?token=${token}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      
      const data = await response.json();
      
      // Convert backend response to frontend format
      const usersData = data.users.map((user: any) => ({
        uid: user.id,
        email: user.email,
        phone: user.phone,
        createdAt: user.created_at,
        lastLogin: user.last_login
      }));
      
      setUsers(usersData);
      setTotalUsers(data.total);
    } catch (error) {
      console.error("Fetch users error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users from backend",
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

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone?.includes(searchQuery)
  );

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
              <h1 className="text-2xl font-bold text-white animate-dancing-glow">Users Management</h1>
              <p className="text-sm text-white/60 animate-glow-text">{totalUsers} total users</p>
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2 animate-dancing-glow">
                  <Users className="w-5 h-5 text-white/80 animate-sparkling" />
                  All Users
                </CardTitle>
                <CardDescription className="text-white/60 animate-glow-text">
                  Manage and view all registered users
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/30 text-white placeholder:text-white/50 focus:border-white transition-all duration-300"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-white/70 animate-pulse-scale">Loading users...</div>
            ) : (
              <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-white/70">Email</TableHead>
                      <TableHead className="text-white/70">Phone</TableHead>
                      <TableHead className="text-white/70">Created At</TableHead>
                      <TableHead className="text-white/70">Last Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow 
                        key={user.uid} 
                        className="border-white/10 hover:bg-white/5 cursor-pointer transition-all duration-300"
                        onClick={() => navigate(`/admin/users/${user.uid}`)}
                      >
                        <TableCell className="text-white flex items-center gap-2">
                          <Mail className="w-4 h-4 text-white/60" />
                          {user.email}
                          {user.displayName && (
                            <span className="text-white/50 text-xs ml-2">({user.displayName})</span>
                          )}
                        </TableCell>
                        <TableCell className="text-white/70">
                          {user.phone ? (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-white/60" />
                              {user.phone}
                            </div>
                          ) : (
                            <span className="text-white/30">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-white/70">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-white/60" />
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="text-white/70">
                          {user.lastLogin ? (
                            new Date(user.lastLogin).toLocaleString()
                          ) : (
                            <span className="text-white/30">Never</span>
                          )}
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
