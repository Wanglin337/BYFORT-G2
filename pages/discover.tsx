import { useEffect } from "react";
import { useVideos } from "@/hooks/use-videos";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Hash, Users, Music } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Discover() {
  const { data: videos, isLoading } = useVideos(20);
  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = "BYFORT 🌙 - Discover";
  }, []);

  const trendingHashtags = [
    "#dance", "#cooking", "#travel", "#comedy", "#music", "#fashion", "#art", "#fitness"
  ];

  return (
    <div className={`min-h-screen bg-black p-4 ${isMobile ? 'pb-20 pt-20' : 'pt-4'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[var(--byfort-cyan)]" />
            Discover
          </h1>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search videos, users, or hashtags..."
            className="pl-10 bg-[var(--byfort-gray)] border-[var(--byfort-light-gray)] text-white placeholder-gray-400"
          />
        </div>

        {/* Trending Hashtags */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <Hash className="w-5 h-5 text-[var(--byfort-pink)]" />
            Trending Hashtags
          </h2>
          <div className="flex flex-wrap gap-2">
            {trendingHashtags.map((hashtag) => (
              <Badge
                key={hashtag}
                variant="secondary"
                className="bg-[var(--byfort-gray)] text-[var(--byfort-cyan)] hover:bg-[var(--byfort-light-gray)] cursor-pointer"
              >
                {hashtag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(12).fill(0).map((_, i) => (
              <Card key={i} className="bg-[var(--byfort-gray)] border-[var(--byfort-light-gray)]">
                <CardContent className="p-0">
                  <div className="aspect-[9/16] bg-[var(--byfort-light-gray)] animate-pulse rounded-t-lg"></div>
                  <div className="p-3">
                    <div className="h-4 bg-[var(--byfort-light-gray)] rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-[var(--byfort-light-gray)] rounded animate-pulse w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos?.map((video) => (
              <Card key={video.id} className="bg-[var(--byfort-gray)] border-[var(--byfort-light-gray)] hover:bg-[var(--byfort-light-gray)] transition-colors cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-[9/16] relative overflow-hidden rounded-t-lg">
                    <img
                      src={video.thumbnailUrl || "https://via.placeholder.com/400x600?text=Video"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '0:30'}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-white text-sm mb-1 line-clamp-2">{video.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Users className="w-3 h-3" />
                      {video.user?.username || 'Unknown'}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>{video.viewsCount?.toLocaleString() || 0} views</span>
                      <span>{video.likesCount?.toLocaleString() || 0} likes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
