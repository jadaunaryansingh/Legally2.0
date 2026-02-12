import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import BalanceScaleIcon from "@/components/BalanceScaleIcon";
import { 
  Users, 
  LogOut,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  MessageSquare,
  Clock,
  User,
  Edit,
  Trash2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface UserData {
  uid: string;
  email: string;
  phone?: string;
  createdAt: number;
  lastLogin?: number;
  displayName?: string;
  photoURL?: string;
}

interface ChatMessage {
  id?: string;
  userId: string;
  userEmail: string;
  message: string;
  response: string;
  category?: string;
  timestamp: number;
}

export default function AdminUserDetails() {
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({ email: "", phone: "", displayName: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/login");
      return;
    }
    
    if (userId) {
      fetchUserDetails(userId);
    }
  }, [navigate, userId]);

  const fetchUserDetails = async (uid: string) => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/login");
        return;
      }
      
      // Fetch user details from backend API
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const [userResponse, chatsResponse] = await Promise.all([
        fetch(`${apiBaseUrl}/api/v1/admin/users/${uid}?token=${token}`),
        fetch(`${apiBaseUrl}/api/v1/admin/users/${uid}/chats?token=${token}`)
      ]);
      
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user details");
      }
      
      const userData = await userResponse.json();
      const chatsData = await chatsResponse.json();
      
      // Convert to frontend format
      setUserData({
        uid: userData.id,
        email: userData.email,
        phone: userData.phone,
        createdAt: userData.created_at,
        lastLogin: userData.last_login,
        displayName: userData.display_name,
        photoURL: userData.photo_url
      });
      
      setChatHistory(chatsData.chats || []);
    } catch (error) {
      console.error("Fetch user details error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user details from backend",
        variant: "destructive",
      });
      navigate("/admin/users");
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

  const handleEditClick = () => {
    if (userData) {
      setEditForm({
        email: userData.email,
        phone: userData.phone || "",
        displayName: userData.displayName || ""
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateUser = async () => {
    if (!userId) return;
    
    try {
      setIsUpdating(true);
      const token = localStorage.getItem("adminToken");
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiBaseUrl}/api/v1/admin/users/${userId}?token=${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: editForm.email,
          phone: editForm.phone || null,
          display_name: editForm.displayName || null
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Failed to update user");
      }
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      
      setIsEditDialogOpen(false);
      fetchUserDetails(userId); // Refresh data
    } catch (error) {
      console.error("Update user error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userId) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiBaseUrl}/api/v1/admin/users/${userId}?token=${token}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      
      toast({
        title: "Success",
        description: "User and all associated data deleted successfully",
      });
      
      navigate("/admin/users");
    } catch (error) {
      console.error("Delete user error:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      "Criminal Law": "bg-red-500/20 text-red-200 border-red-500/30",
      "Civil Rights": "bg-blue-500/20 text-blue-200 border-blue-500/30",
      "Corporate Law": "bg-green-500/20 text-green-200 border-green-500/30",
      "Family Law": "bg-pink-500/20 text-pink-200 border-pink-500/30",
      "Tax Law": "bg-yellow-500/20 text-yellow-200 border-yellow-500/30",
      "General": "bg-gray-500/20 text-gray-200 border-gray-500/30",
    };
    return colors[category || "General"] || colors["General"];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white animate-pulse-scale">Loading user details...</div>
      </div>
    );
  }

  if (!userData) {
    return null;
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
              <h1 className="text-2xl font-bold text-white animate-dancing-glow">User Details</h1>
              <p className="text-sm text-white/60 animate-glow-text">Complete User Profile & History</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/users")}
              className="border-white/30 text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
              className="border-white/30 text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
              Dashboard
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-white text-black hover:bg-white/90 transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid gap-6 mb-8">
          {/* User Info Card */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-500 animate-slide-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Information
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={handleEditClick}
                    variant="outline"
                    size="sm"
                    className="border-blue-500/30 text-blue-200 hover:bg-blue-500/20 transition-all"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-200 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <Mail className="w-5 h-5 text-white/60 mt-1" />
                    <div>
                      <p className="text-xs text-white/60 mb-1">Email Address</p>
                      <p className="text-white font-medium">{userData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <Phone className="w-5 h-5 text-white/60 mt-1" />
                    <div>
                      <p className="text-xs text-white/60 mb-1">Phone Number</p>
                      <p className="text-white font-medium">{userData.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <Calendar className="w-5 h-5 text-white/60 mt-1" />
                    <div>
                      <p className="text-xs text-white/60 mb-1">Account Created</p>
                      <p className="text-white font-medium">
                        {userData.createdAt ? new Date(userData.createdAt).toLocaleString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <Clock className="w-5 h-5 text-white/60 mt-1" />
                    <div>
                      <p className="text-xs text-white/60 mb-1">Last Login</p>
                      <p className="text-white font-medium">
                        {userData.lastLogin ? new Date(userData.lastLogin).toLocaleString() : "Never"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {userData.displayName && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-white/60 mb-1">Display Name</p>
                  <p className="text-white font-medium">{userData.displayName}</p>
                </div>
              )}

              <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-white/60 mb-1">User ID</p>
                <p className="text-white/70 font-mono text-sm">{userData.uid}</p>
              </div>
            </CardContent>
          </Card>

          {/* Chat History Card */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-500 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Chat History
                <Badge className="ml-2 bg-white/10 text-white border-white/20">
                  {chatHistory.length} messages
                </Badge>
              </CardTitle>
              <CardDescription className="text-white/60">
                Complete conversation history with AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chatHistory.length === 0 ? (
                <div className="text-center py-8 text-white/50">
                  No chat history available
                </div>
              ) : (
                <div className="rounded-md border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-white/70">User Query</TableHead>
                        <TableHead className="text-white/70">AI Response</TableHead>
                        <TableHead className="text-white/70">Category</TableHead>
                        <TableHead className="text-white/70">Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chatHistory.map((chat, index) => (
                        <TableRow key={chat.id || index} className="border-white/10 hover:bg-white/5 transition-all duration-300">
                          <TableCell className="text-white max-w-md">
                            <p className="text-sm whitespace-pre-wrap">{chat.message}</p>
                          </TableCell>
                          <TableCell className="text-white/70 max-w-lg">
                            <p className="text-sm whitespace-pre-wrap line-clamp-3">{chat.response}</p>
                          </TableCell>
                          <TableCell>
                            {chat.category && (
                              <Badge className={getCategoryColor(chat.category)}>
                                {chat.category}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-white/70 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-white/60" />
                              <div className="text-xs">
                                <div>{new Date(chat.timestamp).toLocaleDateString()}</div>
                                <div className="text-white/50">{new Date(chat.timestamp).toLocaleTimeString()}</div>
                              </div>
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

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Edit User Information</DialogTitle>
            <DialogDescription className="text-white/60">
              Update user details. Changes will be reflected immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="+1234567890"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                value={editForm.displayName}
                onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                placeholder="Optional"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-red-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              This action cannot be undone. This will permanently delete the user account,
              all chat history, and remove all associated data from our servers.
              <br /><br />
              <strong className="text-white">User ID:</strong> {userData?.uid}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/30 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
