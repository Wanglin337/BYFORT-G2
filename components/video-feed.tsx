import { useEffect, useRef, useState } from "react";
import { useVideos } from "@/hooks/use-videos";
import VideoPlayer from "./video-player";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideoFeed() {
  const { data: videos, isLoading } = useVideos(10);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, clientHeight } = container;
      const videoIndex = Math.round(scrollTop / clientHeight);
      setCurrentVideoIndex(videoIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="w-full max-w-sm mx-auto">
          <Skeleton className="w-full h-screen bg-[var(--byfort-gray)]" />
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">No videos yet</h2>
          <p className="text-gray-400">Be the first to upload a video!</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`video-feed ${isMobile ? 'max-w-sm mx-auto' : 'max-w-md mx-auto'}`}
    >
      {videos.map((video, index) => (
        <div key={video.id} className="video-item">
          <VideoPlayer
            video={video}
            isActive={index === currentVideoIndex}
            isMobile={isMobile}
          />
        </div>
      ))}
    </div>
  );
}
