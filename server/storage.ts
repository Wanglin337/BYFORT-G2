import { users, videos, likes, comments, follows, type User, type Video, type Like, type Comment, type Follow, type InsertUser, type InsertVideo, type InsertLike, type InsertComment, type InsertFollow } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Video methods
  getVideo(id: number): Promise<Video | undefined>;
  getVideosByUser(userId: number): Promise<Video[]>;
  getVideosForFeed(limit?: number, offset?: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, updates: Partial<Video>): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<boolean>;
  
  // Like methods
  getLike(userId: number, videoId: number): Promise<Like | undefined>;
  createLike(like: InsertLike): Promise<Like>;
  deleteLike(userId: number, videoId: number): Promise<boolean>;
  
  // Comment methods
  getCommentsByVideo(videoId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;
  
  // Follow methods
  getFollow(followerId: number, followingId: number): Promise<Follow | undefined>;
  getFollowers(userId: number): Promise<User[]>;
  getFollowing(userId: number): Promise<User[]>;
  createFollow(follow: InsertFollow): Promise<Follow>;
  deleteFollow(followerId: number, followingId: number): Promise<boolean>;
  
  // Admin methods
  getStats(): Promise<{
    totalUsers: number;
    totalVideos: number;
    totalLikes: number;
    totalComments: number;
  }>;
  getTrendingVideos(limit?: number): Promise<Video[]>;
  getTopCreators(limit?: number): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private videos: Map<number, Video> = new Map();
  private likes: Map<string, Like> = new Map();
  private comments: Map<number, Comment> = new Map();
  private follows: Map<string, Follow> = new Map();
  
  private currentUserId = 1;
  private currentVideoId = 1;
  private currentLikeId = 1;
  private currentCommentId = 1;
  private currentFollowId = 1;

  constructor() {
    // Add some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample users
    const sampleUsers = [
      {
        username: "dancequeenx",
        email: "dance@example.com",
        password: "password123",
        displayName: "Dance Queen",
        bio: "Professional dancer & choreographer",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        followersCount: 2300000,
        followingCount: 543,
        likesCount: 15000000,
        isVerified: true,
      },
      {
        username: "chefmike",
        email: "chef@example.com",
        password: "password123",
        displayName: "Chef Mike",
        bio: "Cooking quick & delicious meals",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        followersCount: 1800000,
        followingCount: 287,
        likesCount: 8500000,
        isVerified: true,
      },
      {
        username: "travelblogger",
        email: "travel@example.com",
        password: "password123",
        displayName: "Travel Blogger",
        bio: "Exploring the world one video at a time",
        avatar: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=150&h=150&fit=crop&crop=face",
        followersCount: 1500000,
        followingCount: 412,
        likesCount: 6200000,
        isVerified: true,
        isAdmin: false,
      },
      {
        username: "admin",
        email: "admin@byfort.com",
        password: "admin123",
        displayName: "BYFORT Admin",
        bio: "Official BYFORT Admin Account",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        followersCount: 100000,
        followingCount: 0,
        likesCount: 0,
        isVerified: true,
        isAdmin: true,
      }
    ];

    sampleUsers.forEach(userData => {
      const user: User = {
        id: this.currentUserId++,
        ...userData,
        bio: userData.bio || null,
        avatar: userData.avatar || null,
        followersCount: userData.followersCount || 0,
        followingCount: userData.followingCount || 0,
        likesCount: userData.likesCount || 0,
        isVerified: userData.isVerified || false,
        isAdmin: userData.isAdmin || false,
        createdAt: new Date(),
      };
      this.users.set(user.id, user);
    });

    // Create sample videos
    const sampleVideos = [
      {
        userId: 1,
        title: "New Dance Challenge",
        description: "🔥 New dance trend! Try this at home #DanceChallenge #BYFORT",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
        duration: 60,
        likesCount: 142000,
        commentsCount: 8200,
        sharesCount: 1500,
        viewsCount: 2300000,
        tags: ["dance", "challenge", "trending"],
      },
      {
        userId: 2,
        title: "Quick Pasta Recipe",
        description: "🍳 Quick pasta recipe in 60 seconds! #CookingHacks #PastaLove",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop",
        duration: 45,
        likesCount: 89000,
        commentsCount: 3100,
        sharesCount: 890,
        viewsCount: 856000,
        tags: ["cooking", "recipe", "pasta"],
      },
      {
        userId: 3,
        title: "Hidden Beach Paradise",
        description: "🏖️ Found this amazing hidden beach! #Travel #Paradise #Beach",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=600&fit=crop",
        duration: 75,
        likesCount: 67000,
        commentsCount: 2400,
        sharesCount: 1200,
        viewsCount: 1200000,
        tags: ["travel", "beach", "paradise"],
      }
    ];

    sampleVideos.forEach(videoData => {
      const video: Video = {
        id: this.currentVideoId++,
        userId: videoData.userId || null,
        title: videoData.title,
        description: videoData.description || null,
        videoUrl: videoData.videoUrl,
        thumbnailUrl: videoData.thumbnailUrl || null,
        duration: videoData.duration || null,
        likesCount: videoData.likesCount || 0,
        commentsCount: videoData.commentsCount || 0,
        sharesCount: videoData.sharesCount || 0,
        viewsCount: videoData.viewsCount || 0,
        tags: videoData.tags || null,
        isPublic: true,
        createdAt: new Date(),
      };
      this.videos.set(video.id, video);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      ...insertUser,
      bio: insertUser.bio || null,
      avatar: insertUser.avatar || null,
      followersCount: 0,
      followingCount: 0,
      likesCount: 0,
      isVerified: false,
      isAdmin: false,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Video methods
  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getVideosByUser(userId: number): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(video => video.userId === userId);
  }

  async getVideosForFeed(limit = 10, offset = 0): Promise<Video[]> {
    const allVideos = Array.from(this.videos.values())
      .filter(video => video.isPublic)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    
    return allVideos.slice(offset, offset + limit);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const video: Video = {
      id: this.currentVideoId++,
      userId: insertVideo.userId || null,
      title: insertVideo.title,
      description: insertVideo.description || null,
      videoUrl: insertVideo.videoUrl,
      thumbnailUrl: insertVideo.thumbnailUrl || null,
      duration: insertVideo.duration || null,
      tags: insertVideo.tags || null,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 0,
      isPublic: insertVideo.isPublic ?? true,
      createdAt: new Date(),
    };
    this.videos.set(video.id, video);
    return video;
  }

  async updateVideo(id: number, updates: Partial<Video>): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    
    const updatedVideo = { ...video, ...updates };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }

  async deleteVideo(id: number): Promise<boolean> {
    return this.videos.delete(id);
  }

  // Like methods
  async getLike(userId: number, videoId: number): Promise<Like | undefined> {
    return this.likes.get(`${userId}-${videoId}`);
  }

  async createLike(insertLike: InsertLike): Promise<Like> {
    const like: Like = {
      id: this.currentLikeId++,
      userId: insertLike.userId || null,
      videoId: insertLike.videoId || null,
      createdAt: new Date(),
    };
    this.likes.set(`${like.userId}-${like.videoId}`, like);
    
    // Update video likes count
    const video = this.videos.get(like.videoId!);
    if (video) {
      video.likesCount = (video.likesCount || 0) + 1;
      this.videos.set(video.id, video);
    }
    
    return like;
  }

  async deleteLike(userId: number, videoId: number): Promise<boolean> {
    const deleted = this.likes.delete(`${userId}-${videoId}`);
    
    if (deleted) {
      // Update video likes count
      const video = this.videos.get(videoId);
      if (video && video.likesCount! > 0) {
        video.likesCount = video.likesCount! - 1;
        this.videos.set(video.id, video);
      }
    }
    
    return deleted;
  }

  // Comment methods
  async getCommentsByVideo(videoId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.videoId === videoId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const comment: Comment = {
      id: this.currentCommentId++,
      userId: insertComment.userId || null,
      videoId: insertComment.videoId || null,
      content: insertComment.content,
      likesCount: 0,
      createdAt: new Date(),
    };
    this.comments.set(comment.id, comment);
    
    // Update video comments count
    const video = this.videos.get(comment.videoId!);
    if (video) {
      video.commentsCount = (video.commentsCount || 0) + 1;
      this.videos.set(video.id, video);
    }
    
    return comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    const comment = this.comments.get(id);
    if (!comment) return false;
    
    const deleted = this.comments.delete(id);
    
    if (deleted) {
      // Update video comments count
      const video = this.videos.get(comment.videoId!);
      if (video && video.commentsCount! > 0) {
        video.commentsCount = video.commentsCount! - 1;
        this.videos.set(video.id, video);
      }
    }
    
    return deleted;
  }

  // Follow methods
  async getFollow(followerId: number, followingId: number): Promise<Follow | undefined> {
    return this.follows.get(`${followerId}-${followingId}`);
  }

  async getFollowers(userId: number): Promise<User[]> {
    const followerIds = Array.from(this.follows.values())
      .filter(follow => follow.followingId === userId)
      .map(follow => follow.followerId!);
    
    return followerIds.map(id => this.users.get(id)).filter(Boolean) as User[];
  }

  async getFollowing(userId: number): Promise<User[]> {
    const followingIds = Array.from(this.follows.values())
      .filter(follow => follow.followerId === userId)
      .map(follow => follow.followingId!);
    
    return followingIds.map(id => this.users.get(id)).filter(Boolean) as User[];
  }

  async createFollow(insertFollow: InsertFollow): Promise<Follow> {
    const follow: Follow = {
      id: this.currentFollowId++,
      followerId: insertFollow.followerId || null,
      followingId: insertFollow.followingId || null,
      createdAt: new Date(),
    };
    this.follows.set(`${follow.followerId}-${follow.followingId}`, follow);
    
    // Update follower counts
    const follower = this.users.get(follow.followerId!);
    const following = this.users.get(follow.followingId!);
    
    if (follower) {
      follower.followingCount = (follower.followingCount || 0) + 1;
      this.users.set(follower.id, follower);
    }
    
    if (following) {
      following.followersCount = (following.followersCount || 0) + 1;
      this.users.set(following.id, following);
    }
    
    return follow;
  }

  async deleteFollow(followerId: number, followingId: number): Promise<boolean> {
    const deleted = this.follows.delete(`${followerId}-${followingId}`);
    
    if (deleted) {
      // Update follower counts
      const follower = this.users.get(followerId);
      const following = this.users.get(followingId);
      
      if (follower && follower.followingCount! > 0) {
        follower.followingCount = follower.followingCount! - 1;
        this.users.set(follower.id, follower);
      }
      
      if (following && following.followersCount! > 0) {
        following.followersCount = following.followersCount! - 1;
        this.users.set(following.id, following);
      }
    }
    
    return deleted;
  }

  // Admin methods
  async getStats(): Promise<{
    totalUsers: number;
    totalVideos: number;
    totalLikes: number;
    totalComments: number;
  }> {
    return {
      totalUsers: this.users.size,
      totalVideos: this.videos.size,
      totalLikes: this.likes.size,
      totalComments: this.comments.size,
    };
  }

  async getTrendingVideos(limit = 10): Promise<Video[]> {
    return Array.from(this.videos.values())
      .filter(video => video.isPublic)
      .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
      .slice(0, limit);
  }

  async getTopCreators(limit = 10): Promise<User[]> {
    return Array.from(this.users.values())
      .filter(user => !user.isAdmin)
      .sort((a, b) => (b.followersCount || 0) - (a.followersCount || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
