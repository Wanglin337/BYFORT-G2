import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Video {
  id: number;
  userId: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  tags?: string[];
  isPublic: boolean;
  createdAt: Date;
  user?: {
    id: number;
    username: string;
    displayName: string;
    avatar?: string;
    isVerified: boolean;
  };
}

export function useVideos(limit = 10, offset = 0) {
  return useQuery<Video[]>({
    queryKey: ['/api/videos', limit, offset],
    queryFn: async () => {
      const response = await fetch(`/api/videos?limit=${limit}&offset=${offset}`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      return response.json();
    },
  });
}

export function useVideo(id: number) {
  return useQuery<Video>({
    queryKey: ['/api/videos', id],
    queryFn: async () => {
      const response = await fetch(`/api/videos/${id}`);
      if (!response.ok) throw new Error('Failed to fetch video');
      return response.json();
    },
  });
}

export function useCreateVideo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (videoData: {
      title: string;
      description: string;
      videoUrl: string;
      thumbnailUrl?: string;
      tags?: string[];
    }) => {
      const response = await apiRequest('POST', '/api/videos', videoData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      toast({
        title: "Success!",
        description: "Video uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload video",
        variant: "destructive",
      });
    },
  });
}

export function useLikeVideo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ videoId, isLiked }: { videoId: number; isLiked: boolean }) => {
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await apiRequest(method, `/api/videos/${videoId}/like`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update like",
        variant: "destructive",
      });
    },
  });
}

export function useComments(videoId: number) {
  return useQuery({
    queryKey: ['/api/videos', videoId, 'comments'],
    queryFn: async () => {
      const response = await fetch(`/api/videos/${videoId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json();
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ videoId, content }: { videoId: number; content: string }) => {
      const response = await apiRequest('POST', `/api/videos/${videoId}/comments`, { content });
      return response.json();
    },
    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos', videoId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      toast({
        title: "Comment posted",
        description: "Your comment has been added",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post comment",
        variant: "destructive",
      });
    },
  });
}
