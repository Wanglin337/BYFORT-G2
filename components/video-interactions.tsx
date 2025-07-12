import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2, Bookmark, Music } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLikeVideo } from "@/hooks/use-videos";
import { cn } from "@/lib/utils";

interface VideoInteractionsProps {
  video: {
    id: number;
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    title: string;
    description: string;
  };
  onComment: () => void;
  className?: string;
}

export default function VideoInteractions({ video, onComment, className }: VideoInteractionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { mutate: likeVideo } = useLikeVideo();

  const handleLike = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to like videos",
        variant: "destructive",
      });
      return;
    }

    likeVideo({ videoId: video.id, isLiked });
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Video link copied to clipboard",
      });
    }
  };

  const handleSave = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to save videos",
        variant: "destructive",
      });
      return;
    }

    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from favorites" : "Added to favorites",
      description: isSaved ? "Video removed from your favorites" : "Video added to your favorites",
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Like Button */}
      <div className="flex flex-col items-center">
        <Button
          onClick={handleLike}
          className={cn(
            "bg-black/30 hover:bg-black/50 p-3 rounded-full backdrop-blur-sm transition-all duration-200",
            isLiked ? "text-red-500 scale-110" : "text-white"
          )}
          size="sm"
        >
          <Heart className={cn("w-7 h-7", isLiked && "fill-current")} />
        </Button>
        <span className="text-xs text-white mt-1 font-medium">
          {(video.likesCount + (isLiked ? 1 : 0)).toLocaleString()}
        </span>
      </div>

      {/* Comment Button */}
      <div className="flex flex-col items-center">
        <Button
          onClick={onComment}
          className="bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200"
          size="sm"
        >
          <MessageSquare className="w-7 h-7" />
        </Button>
        <span className="text-xs text-white mt-1 font-medium">
          {video.commentsCount.toLocaleString()}
        </span>
      </div>

      {/* Share Button */}
      <div className="flex flex-col items-center">
        <Button
          onClick={handleShare}
          className="bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200"
          size="sm"
        >
          <Share2 className="w-7 h-7" />
        </Button>
        <span className="text-xs text-white mt-1 font-medium">
          {video.sharesCount.toLocaleString()}
        </span>
      </div>

      {/* Save Button */}
      <div className="flex flex-col items-center">
        <Button
          onClick={handleSave}
          className={cn(
            "bg-black/30 hover:bg-black/50 p-3 rounded-full backdrop-blur-sm transition-all duration-200",
            isSaved ? "text-yellow-500" : "text-white"
          )}
          size="sm"
        >
          <Bookmark className={cn("w-7 h-7", isSaved && "fill-current")} />
        </Button>
      </div>

      {/* Music Button */}
      <div className="flex flex-col items-center">
        <Button
          className="bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200"
          size="sm"
        >
          <Music className="w-7 h-7" />
        </Button>
      </div>
    </div>
  );
}