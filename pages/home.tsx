import { useEffect, useState } from "react";
import VideoFeed from "@/components/video-feed";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, User } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');

  useEffect(() => {
    document.title = "BYFORT 🌙 - Home";
  }, []);

  return (
    <div className={`min-h-screen ${isMobile ? 'pb-20' : 'pb-0'} bg-black`}>
      {/* Fixed Header with Tabs */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="flex justify-center py-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'foryou' | 'following')}>
            <TabsList className="bg-transparent border-none">
              <TabsTrigger 
                value="following" 
                className="text-white/60 data-[state=active]:text-white data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-white rounded-none px-6 py-2"
              >
                Following
              </TabsTrigger>
              <TabsTrigger 
                value="foryou" 
                className="text-white/60 data-[state=active]:text-white data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-white rounded-none px-6 py-2"
              >
                For You
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Video Feed */}
      <div className="pt-16">
        <VideoFeed />
      </div>
    </div>
  );
}
