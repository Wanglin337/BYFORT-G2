import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Edit, MessageSquare, Users, Heart, Play, Grid, Bookmark, Lock, Plus, ChevronRight, DollarSign, History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Profile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("videos");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    username: user?.username || '',
  });
  const { toast } = useToast();

  const { data: userVideos } = useQuery({
    queryKey: [`/api/users/${user?.id}/videos`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user?.id,
  });

  const { data: userStats } = useQuery({
    queryKey: [`/api/users/${user?.id}/stats`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user?.id,
  });

  // Check if user is eligible for monetization (1000+ followers)
  const isMonetizationEligible = (user?.followersCount || 0) >= 1000;

  const handleEditProfile = () => {
    // Handle edit profile logic
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditModalOpen(false);
  };

  const handleWithdraw = () => {
    // Handle withdraw logic
    toast({
      title: "Withdraw Request Submitted",
      description: "Your withdrawal request will be processed within 24 hours.",
    });
    setIsWithdrawModalOpen(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--byfort-dark)]">
        <div className="text-center">
          <h1 className="text-white text-xl mb-4">Please log in to view your profile</h1>
          <Button>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[var(--byfort-dark)] text-white ${isMobile ? 'pb-20' : 'pt-16'}`}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--byfort-gray)]">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.displayName[0]}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{user.username}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setLocation("/settings")}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Profile Info */}
        <div className="p-4 text-center">
          <div className="relative inline-block mb-4">
            <Avatar className="h-24 w-24 mx-auto border-4 border-[var(--byfort-pink)]">
              <AvatarImage src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
              <AvatarFallback className="text-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                {user.displayName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[var(--byfort-pink)] rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-1">{user.displayName}</h1>
          <p className="text-gray-400 mb-2">@{user.username}</p>
          
          {user.isVerified && (
            <Badge className="mb-4 bg-blue-500 text-white">
              <MessageSquare className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
          
          {user.bio && (
            <p className="text-sm text-gray-300 mb-4 max-w-xs mx-auto">{user.bio}</p>
          )}

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-xl font-bold">{user.followingCount}</div>
              <div className="text-xs text-gray-400">Following</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{user.followersCount}</div>
              <div className="text-xs text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{user.likesCount}</div>
              <div className="text-xs text-gray-400">Likes</div>
            </div>
          </div>

          {/* Monetization Status */}
          {isMonetizationEligible && (
            <div className="mb-4 p-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Monetization Active</span>
              </div>
              <p className="text-sm text-white/90">You're eligible for creator fund!</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mb-6">
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 border-gray-600 text-white hover:bg-gray-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[var(--byfort-dark)] border-gray-600">
                <DialogHeader>
                  <DialogTitle className="text-white">Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="displayName" className="text-white">Display Name</Label>
                    <Input
                      id="displayName"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                      className="bg-[var(--byfort-gray)] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username" className="text-white">Username</Label>
                    <Input
                      id="username"
                      value={editForm.username}
                      onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                      className="bg-[var(--byfort-gray)] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      className="bg-[var(--byfort-gray)] border-gray-600 text-white"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleEditProfile} className="w-full bg-[var(--byfort-pink)]">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="icon" className="border-gray-600 text-white hover:bg-gray-700">
              <MessageSquare className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon" className="border-gray-600 text-white hover:bg-gray-700">
              <Users className="h-4 w-4" />
            </Button>
          </div>

          {/* Monetization Section */}
          {isMonetizationEligible && (
            <div className="mb-6 space-y-2">
              <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Withdraw Earnings
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[var(--byfort-dark)] border-gray-600">
                  <DialogHeader>
                    <DialogTitle className="text-white">Withdraw Earnings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">$247.50</div>
                        <div className="text-sm text-white/90">Available Balance</div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="amount" className="text-white">Withdraw Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        className="bg-[var(--byfort-gray)] border-gray-600 text-white"
                      />
                    </div>
                    <Button onClick={handleWithdraw} className="w-full bg-[var(--byfort-pink)]">
                      Request Withdrawal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                <History className="h-4 w-4 mr-2" />
                Withdraw History
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[var(--byfort-gray)]">
            <TabsTrigger value="videos" className="flex items-center gap-2 data-[state=active]:bg-[var(--byfort-pink)]">
              <Grid className="h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex items-center gap-2 data-[state=active]:bg-[var(--byfort-pink)]">
              <Heart className="h-4 w-4" />
              Liked
            </TabsTrigger>
            <TabsTrigger value="private" className="flex items-center gap-2 data-[state=active]:bg-[var(--byfort-pink)]">
              <Lock className="h-4 w-4" />
              Private
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="p-4">
            <div className="grid grid-cols-3 gap-1">
              {userVideos?.map((video: any) => (
                <div key={video.id} className="aspect-[9/16] bg-[var(--byfort-gray)] rounded-lg overflow-hidden relative group hover:scale-105 transition-transform">
                  <video
                    src={video.videoUrl}
                    className="w-full h-full object-cover"
                    poster={video.thumbnailUrl}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute bottom-2 left-2 text-xs bg-black/70 px-2 py-1 rounded">
                    <Play className="h-3 w-3 inline mr-1" />
                    {video.viewsCount?.toLocaleString() || 0}
                  </div>
                </div>
              ))}
              {(!userVideos || userVideos.length === 0) && (
                <div className="col-span-3 text-center py-8">
                  <Play className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">No videos yet</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="liked" className="p-4">
            <div className="text-center py-8">
              <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">Videos you liked will appear here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="private" className="p-4">
            <div className="text-center py-8">
              <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">Your private videos will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}