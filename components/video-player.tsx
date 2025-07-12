import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share2, Play, Pause, Volume2, VolumeX, Music, Check } from "lucide-react";
import { useLikeVideo, useCreateComment, useComments } from "@/hooks/use-videos";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  video: {
    id: number;
    userId: number;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string;
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    viewsCount: number;
    tags?: string[];
    user?: {
      id: number;
      username: string;
      displayName: string;
      avatar?: string;
      isVerified: boolean;
    };
  };
  isActive: boolean;
  isMobile: boolean;
}

export default function VideoPlayer({ video, isActive, isMobile }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { mutate: likeVideo } = useLikeVideo();
  const { mutate: createComment } = useCreateComment();
  const { data: comments } = useComments(video.id);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

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

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) return;

    createComment({ videoId: video.id, content: comment });
    setComment("");
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

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        loop
        muted={isMuted}
        playsInline
        onClick={handlePlayPause}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* Play/Pause Button */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={handlePlayPause}
            className="bg-black/30 hover:bg-black/50 text-white rounded-full p-4 backdrop-blur-sm"
            size="lg"
          >
            <Play className="w-8 h-8" />
          </Button>
        </div>
      )}

      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          onClick={handleMute}
          className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm"
          size="sm"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      </div>

      {/* Creator Info */}
      <div className="absolute bottom-24 left-4 right-20 text-white">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={video.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user?.username}`}
            alt={video.user?.displayName || 'User'}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">@{video.user?.username || 'unknown'}</p>
              {video.user?.isVerified && (
                <Check className="w-4 h-4 text-[var(--byfort-cyan)]" />
              )}
            </div>
            <p className="text-sm text-gray-300">Follow</p>
          </div>
        </div>
        
        <p className="text-sm mb-2 line-clamp-2">{video.description}</p>
        
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {video.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-black/30 text-white">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Music className="w-4 h-4" />
            Original Sound
          </span>
          <span>{video.viewsCount?.toLocaleString() || 0} views</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-32 right-4 flex flex-col gap-6">
        <div className="flex flex-col items-center">
          <Button
            onClick={handleLike}
            className={cn(
              "bg-black/30 hover:bg-black/50 p-3 rounded-full backdrop-blur-sm transition-colors",
              isLiked ? "text-[var(--byfort-pink)]" : "text-white"
            )}
            size="sm"
          >
            <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
          </Button>
          <span className="text-xs text-white mt-1">
            {(video.likesCount + (isLiked ? 1 : 0)).toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <Button
            onClick={() => setShowComments(!showComments)}
            className="bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm"
            size="sm"
          >
            <MessageSquare className="w-6 h-6" />
          </Button>
          <span className="text-xs text-white mt-1">
            {video.commentsCount?.toLocaleString() || 0}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <Button
            onClick={handleShare}
            className="bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm"
            size="sm"
          >
            <Share2 className="w-6 h-6" />
          </Button>
          <span className="text-xs text-white mt-1">Share</span>
        </div>
      </div>

      {/* Comments Overlay */}
      {showComments && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[var(--byfort-gray)]">
              <h3 className="text-white font-semibold">Comments</h3>
              <Button
                onClick={() => setShowComments(false)}
                className="text-white hover:text-gray-300"
                variant="ghost"
                size="sm"
              >
                ✕
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3">
                      <img
                        src={comment.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.username}`}
                        alt={comment.user?.displayName || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-white text-sm font-medium">{comment.user?.username || 'Unknown'}</p>
                        <p className="text-gray-300 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2" />
                  <p>No comments yet</p>
                  <p className="text-sm">Be the first to comment!</p>
                </div>
              )}
            </div>
            
            {user && (
              <form onSubmit={handleComment} className="p-4 border-t border-[var(--byfort-gray)]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-[var(--byfort-gray)] text-white px-3 py-2 rounded-full text-sm"
                  />
                  <Button
                    type="submit"
                    disabled={!comment.trim()}
                    className="bg-[var(--byfort-pink)] hover:bg-[var(--byfort-pink)]/80 text-white px-4 py-2 rounded-full"
                    size="sm"
                  >
                    Post
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
