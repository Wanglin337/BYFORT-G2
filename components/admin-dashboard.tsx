import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useVideos } from "@/hooks/use-videos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Moon, 
  Video, 
  Users, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  Search,
  Settings,
  Plus,
  Check,
  Trash2,
  BarChart3,
  Crown,
  Shield,
  AlertTriangle
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: videos, isLoading: videosLoading } = useVideos(50);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Mock admin stats - in a real app, these would come from API
  const [stats, setStats] = useState({
    totalVideos: 12847,
    activeUsers: 284000,
    totalViews: 89200000,
    revenue: 47200,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");

  // Filter videos based on search
  const filteredVideos = videos?.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.user?.username.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Get trending videos (sorted by likes)
  const trendingVideos = videos?.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0)).slice(0, 10) || [];

  // Get top creators (mock data since we don't have follower counts in videos)
  const topCreators = [
    {
      id: 1,
      username: "dancequeenx",
      displayName: "Dance Queen",
      followersCount: 2300000,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      growth: "+12%",
      isVerified: true,
    },
    {
      id: 2,
      username: "chefmike",
      displayName: "Chef Mike",
      followersCount: 1800000,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      growth: "+8%",
      isVerified: true,
    },
    {
      id: 3,
      username: "travelblogger",
      displayName: "Travel Blogger",
      followersCount: 1500000,
      avatar: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=40&h=40&fit=crop&crop=face",
      growth: "+15%",
      isVerified: true,
    },
  ];

  const handleVideoAction = (videoId: number, action: 'approve' | 'delete') => {
    toast({
      title: `Video ${action === 'approve' ? 'approved' : 'deleted'}`,
      description: `Video has been ${action === 'approve' ? 'approved' : 'removed'} successfully`,
    });
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    growth 
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    growth?: string;
  }) => (
    <Card className="bg-[var(--byfort-dark)] border-[var(--byfort-gray)]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${color.includes('pink') ? 'bg-[var(--byfort-pink)]/20' : 
                                              color.includes('cyan') ? 'bg-[var(--byfort-cyan)]/20' :
                                              color.includes('yellow') ? 'bg-yellow-400/20' :
                                              'bg-green-400/20'}`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
        {growth && (
          <div className="flex items-center mt-2">
            <span className="text-green-400 text-sm">{growth}</span>
            <span className="text-gray-400 text-sm ml-2">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen bg-[var(--byfort-darker)] ${isMobile ? 'pb-20' : ''}`}>
      {/* Header */}
      <div className="bg-[var(--byfort-dark)] border-b border-[var(--byfort-gray)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Moon className="w-8 h-8 text-[var(--byfort-cyan)]" />
              <h1 className="text-2xl font-bold text-white">BYFORT Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button className="bg-[var(--byfort-pink)] hover:bg-[var(--byfort-pink)]/80 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                alt="Admin profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Videos"
            value={stats.totalVideos}
            icon={Video}
            color="text-[var(--byfort-pink)]"
            growth="+12%"
          />
          <StatCard
            title="Active Users"
            value={`${(stats.activeUsers / 1000).toFixed(0)}K`}
            icon={Users}
            color="text-[var(--byfort-cyan)]"
            growth="+8%"
          />
          <StatCard
            title="Total Views"
            value={`${(stats.totalViews / 1000000).toFixed(1)}M`}
            icon={Eye}
            color="text-yellow-400"
            growth="+24%"
          />
          <StatCard
            title="Revenue"
            value={`$${(stats.revenue / 1000).toFixed(1)}K`}
            icon={DollarSign}
            color="text-green-400"
            growth="+15%"
          />
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-[var(--byfort-dark)] border-[var(--byfort-gray)]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[var(--byfort-gray)] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-[var(--byfort-gray)] data-[state=active]:text-white">
              Videos
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-[var(--byfort-gray)] data-[state=active]:text-white">
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[var(--byfort-gray)] data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-[var(--byfort-gray)] data-[state=active]:text-white">
              Trending
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[var(--byfort-gray)] data-[state=active]:text-white">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Videos */}
              <div className="lg:col-span-2">
                <Card className="bg-[var(--byfort-dark)] border-[var(--byfort-gray)]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      Recent Videos
                      <Button variant="ghost" className="text-[var(--byfort-pink)] hover:text-[var(--byfort-pink)]/80">
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredVideos.slice(0, 5).map((video) => (
                        <div key={video.id} className="flex items-center gap-4 p-4 bg-[var(--byfort-gray)]/50 rounded-lg">
                          <img
                            src={video.thumbnailUrl || "https://via.placeholder.com/80x80?text=Video"}
                            alt={video.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{video.title}</h4>
                            <p className="text-sm text-gray-400">@{video.user?.username || 'unknown'}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge variant="secondary" className="bg-[var(--byfort-pink)]/20 text-[var(--byfort-pink)]">
                                Trending
                              </Badge>
                              <span className="text-xs text-gray-400">
                                {video.viewsCount?.toLocaleString() || 0} views
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-400 hover:text-green-300"
                              onClick={() => handleVideoAction(video.id, 'approve')}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => handleVideoAction(video.id, 'delete')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Creators */}
              <div className="space-y-6">
                <Card className="bg-[var(--byfort-dark)] border-[var(--byfort-gray)]">
                  <CardHeader>
                    <CardTitle className="text-white">Top Creators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topCreators.map((creator, index) => (
                        <div key={creator.id} className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-[var(--byfort-pink)] text-white' :
                              index === 1 ? 'bg-[var(--byfort-cyan)] text-black' :
                              'bg-yellow-400 text-black'
                            }`}>
                              {index + 1}
                            </span>
                          </div>
                          <img
                            src={creator.avatar}
                            alt={creator.displayName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-white">{creator.displayName}</p>
                              {creator.isVerified && (
                                <Crown className="w-4 h-4 text-[var(--byfort-cyan)]" />
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              {creator.followersCount.toLocaleString()} followers
                            </p>
                          </div>
                          <span className="text-sm text-green-400">{creator.growth}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Analytics Chart Placeholder */}
                <Card className="bg-[var(--byfort-dark)] border-[var(--byfort-gray)]">
                  <CardHeader>
                    <CardTitle className="text-white">Weekly Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-[var(--byfort-gray)]/30 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-[var(--byfort-cyan)] mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Chart Integration</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search videos or creators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[var(--byfort-gray)] border-[var(--byfort-light-gray)] text-white"
                />
              </div>
              <Button className="bg-[var(--byfort-pink)] hover:bg-[var(--byfort-pink)]/80 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </div>

            <Card className="bg-[var(--byfort-dark)] border-[var(--byfort-gray)]">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="flex items-center gap-4 p-4 bg-[var(--byfort-gray)]/50 rounded-lg">
                      <img
                        src={video.thumbnailUrl || "https://via.placeholder.com/80x80?text=Video"}
                        alt={video.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{video.title}</h4>
                        <p className="text-sm text-gray-400">@{video.user?.username || 'unknown'}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-400">
                            {video.viewsCount?.toLocaleString() || 0} views
                          </span>
                          <span className="text-xs text-gray-400">
                            {video.likesCount?.toLocaleString() || 0} likes
                          </span>
                          <span className="text-xs text-gray-400">
                            {video.commentsCount?.toLocaleString() || 0} comments
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-400 hover:text-green-300"
                          onClick={() => handleVideoAction(video.id, 'approve')}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleVideoAction(video.id, 'delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs with placeholder content */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-[var(--byfort-dark)] border-[var(--byfort-gray)]">
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">User Management</h3>
                <p className="text-gray-400">Manage users, moderators, and permissions</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-[var(--byfort-dark)] border-[var(--byfort-gray)]">
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Analytics Dashboard</h3>
                <p className="text-gray-400">Detailed analytics and reporting</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <Card className="bg-[var(--byfort-dark)] border-[var(--byfort-gray)]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--byfort-pink)]" />
                  Trending Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingVideos.slice(0, 10).map((video, index) => (
                    <div key={video.id} className="flex items-center gap-4 p-4 bg-[var(--byfort-gray)]/50 rounded-lg">
                      <span className="text-[var(--byfort-pink)] font-bold text-lg w-6">
                        #{index + 1}
                      </span>
                      <img
                        src={video.thumbnailUrl || "https://via.placeholder.com/60x60?text=Video"}
                        alt={video.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{video.title}</h4>
                        <p className="text-sm text-gray-400">@{video.user?.username || 'unknown'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[var(--byfort-cyan)]">
                          {video.likesCount?.toLocaleString() || 0} likes
                        </p>
                        <p className="text-xs text-gray-400">
                          {video.viewsCount?.toLocaleString() || 0} views
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-[var(--byfort-dark)] border-[var(--byfort-gray)]">
              <CardContent className="p-8 text-center">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">System Settings</h3>
                <p className="text-gray-400">Configure platform settings and preferences</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
