import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  Heart, 
  UserPlus, 
  AtSign, 
  Search, 
  MoreHorizontal,
  MessageCircle,
  Users,
  Bell,
  Settings,
  Check,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";

interface Notification {
  id: number;
  type: "like" | "comment" | "follow" | "mention";
  user: {
    id: number;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
  };
  content?: string;
  video?: {
    id: number;
    title: string;
    thumbnailUrl: string;
  };
  timestamp: Date;
  isRead: boolean;
}

export default function Inbox() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "like",
      user: {
        id: 2,
        username: "john_doe",
        displayName: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        isVerified: true,
      },
      video: {
        id: 1,
        title: "Amazing dance moves",
        thumbnailUrl: "https://picsum.photos/200/300?random=1",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
    },
    {
      id: 2,
      type: "comment",
      user: {
        id: 3,
        username: "jane_smith",
        displayName: "Jane Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
        isVerified: false,
      },
      content: "This is amazing! How did you do that?",
      video: {
        id: 1,
        title: "Amazing dance moves",
        thumbnailUrl: "https://picsum.photos/200/300?random=1",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: false,
    },
    {
      id: 3,
      type: "follow",
      user: {
        id: 4,
        username: "mike_wilson",
        displayName: "Mike Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
        isVerified: true,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      isRead: true,
    },
    {
      id: 4,
      type: "mention",
      user: {
        id: 5,
        username: "sara_lee",
        displayName: "Sara Lee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara",
        isVerified: false,
      },
      content: "Check out this cool video by @" + user?.username,
      video: {
        id: 2,
        title: "Cool tricks",
        thumbnailUrl: "https://picsum.photos/200/300?random=2",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: true,
    },
  ]);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return `${days}d`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case "mention":
        return <AtSign className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case "like":
        return "liked your video";
      case "comment":
        return "commented on your video";
      case "follow":
        return "started following you";
      case "mention":
        return "mentioned you in a comment";
      default:
        return "sent you a notification";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--byfort-dark)]">
        <div className="text-center">
          <h1 className="text-white text-xl mb-4">Please log in to view your inbox</h1>
          <Button onClick={() => setLocation("/")}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[var(--byfort-dark)] text-white ${isMobile ? 'pb-20' : 'pt-16'}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--byfort-gray)]">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Inbox</h1>
            {unreadCount > 0 && (
              <Badge className="bg-[var(--byfort-pink)] text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[var(--byfort-gray)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[var(--byfort-gray)] border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-[var(--byfort-gray)] mx-4 mt-4">
            <TabsTrigger value="all" className="data-[state=active]:bg-[var(--byfort-pink)]">
              All
            </TabsTrigger>
            <TabsTrigger value="like" className="data-[state=active]:bg-[var(--byfort-pink)]">
              <Heart className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="comment" className="data-[state=active]:bg-[var(--byfort-pink)]">
              <MessageCircle className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="follow" className="data-[state=active]:bg-[var(--byfort-pink)]">
              <UserPlus className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="mention" className="data-[state=active]:bg-[var(--byfort-pink)]">
              <AtSign className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-1">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">No notifications yet</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`bg-[var(--byfort-gray)] border-0 hover:bg-[var(--byfort-light-gray)] transition-colors cursor-pointer ${
                      !notification.isRead ? 'border-l-4 border-l-[var(--byfort-pink)]' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={notification.user.avatar} />
                            <AvatarFallback>{notification.user.displayName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--byfort-dark)] rounded-full flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white truncate">
                              {notification.user.displayName}
                            </span>
                            {notification.user.isVerified && (
                              <Check className="h-4 w-4 text-blue-500" />
                            )}
                            <span className="text-sm text-gray-400">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-300 mb-2">
                            {getNotificationText(notification)}
                          </p>
                          
                          {notification.content && (
                            <p className="text-sm text-white bg-[var(--byfort-dark)] p-2 rounded mb-2">
                              "{notification.content}"
                            </p>
                          )}
                        </div>
                        
                        {notification.video && (
                          <div className="w-16 h-20 bg-[var(--byfort-dark)] rounded-lg overflow-hidden">
                            <img
                              src={notification.video.thumbnailUrl}
                              alt={notification.video.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}