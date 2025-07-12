import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Plus, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface FollowButtonProps {
  userId: number;
  isFollowing?: boolean;
  variant?: "default" | "compact";
}

export default function FollowButton({ userId, isFollowing = false, variant = "default" }: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to follow users",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (following) {
        await apiRequest({
          method: "DELETE",
          url: `/api/users/${userId}/follow`,
        });
        setFollowing(false);
        toast({
          title: "Unfollowed",
          description: "You have unfollowed this user",
        });
      } else {
        await apiRequest({
          method: "POST",
          url: `/api/users/${userId}/follow`,
        });
        setFollowing(true);
        toast({
          title: "Following",
          description: "You are now following this user",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (variant === "compact") {
    return (
      <Button
        onClick={handleFollow}
        disabled={loading}
        size="sm"
        variant={following ? "outline" : "default"}
        className={`${following 
          ? "bg-transparent border-white text-white hover:bg-white hover:text-black" 
          : "bg-white text-black hover:bg-gray-200"
        } font-medium`}
      >
        {following ? (
          <>
            <Check className="w-4 h-4 mr-1" />
            Following
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-1" />
            Follow
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      className={`${following 
        ? "bg-gray-600 text-white hover:bg-gray-700" 
        : "bg-[var(--byfort-pink)] text-white hover:bg-[var(--byfort-pink)]/80"
      } font-semibold`}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}