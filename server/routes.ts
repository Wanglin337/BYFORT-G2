import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertVideoSchema, insertLikeSchema, insertCommentSchema, insertFollowSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Authentication middleware
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const user = await storage.getUser(req.user.id);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      
      res.status(201).json({ 
        user: { ...user, password: undefined }, 
        token 
      });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token 
      });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Login failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Video routes
  app.get("/api/videos", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const videos = await storage.getVideosForFeed(limit, offset);
      
      // Add user information to each video
      const videosWithUsers = await Promise.all(
        videos.map(async (video) => {
          const user = await storage.getUser(video.userId!);
          return {
            ...video,
            user: user ? { ...user, password: undefined } : null,
          };
        })
      );
      
      res.json(videosWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      const user = await storage.getUser(video.userId!);
      
      res.json({
        ...video,
        user: user ? { ...user, password: undefined } : null,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  app.post("/api/videos", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const videoData = insertVideoSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      
      const video = await storage.createVideo(videoData);
      res.status(201).json(video);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create video" });
    }
  });

  app.put("/api/videos/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const videoId = parseInt(req.params.id);
      const video = await storage.getVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      if (video.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const updatedVideo = await storage.updateVideo(videoId, req.body);
      res.json(updatedVideo);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update video" });
    }
  });

  app.delete("/api/videos/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const videoId = parseInt(req.params.id);
      const video = await storage.getVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      if (video.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const deleted = await storage.deleteVideo(videoId);
      res.json({ success: deleted });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to delete video" });
    }
  });

  // Like routes
  app.post("/api/videos/:id/like", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const videoId = parseInt(req.params.id);
      const userId = req.user.id;
      
      const existingLike = await storage.getLike(userId, videoId);
      if (existingLike) {
        return res.status(400).json({ message: "Already liked" });
      }
      
      const like = await storage.createLike({ userId, videoId });
      res.status(201).json(like);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to like video" });
    }
  });

  app.delete("/api/videos/:id/like", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const videoId = parseInt(req.params.id);
      const userId = req.user.id;
      
      const deleted = await storage.deleteLike(userId, videoId);
      res.json({ success: deleted });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to unlike video" });
    }
  });

  // Comment routes
  app.get("/api/videos/:id/comments", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const comments = await storage.getCommentsByVideo(videoId);
      
      // Add user information to each comment
      const commentsWithUsers = await Promise.all(
        comments.map(async (comment) => {
          const user = await storage.getUser(comment.userId!);
          return {
            ...comment,
            user: user ? { ...user, password: undefined } : null,
          };
        })
      );
      
      res.json(commentsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/videos/:id/comments", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const videoId = parseInt(req.params.id);
      const commentData = insertCommentSchema.parse({
        ...req.body,
        userId: req.user.id,
        videoId,
      });
      
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create comment" });
    }
  });

  // Follow routes
  app.post("/api/users/:id/follow", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const followingId = parseInt(req.params.id);
      const followerId = req.user.id;
      
      if (followerId === followingId) {
        return res.status(400).json({ message: "Cannot follow yourself" });
      }
      
      const existingFollow = await storage.getFollow(followerId, followingId);
      if (existingFollow) {
        return res.status(400).json({ message: "Already following" });
      }
      
      const follow = await storage.createFollow({ followerId, followingId });
      res.status(201).json(follow);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to follow user" });
    }
  });

  app.delete("/api/users/:id/follow", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const followingId = parseInt(req.params.id);
      const followerId = req.user.id;
      
      const deleted = await storage.deleteFollow(followerId, followingId);
      res.json({ success: deleted });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to unfollow user" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/users/:id/videos", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const videos = await storage.getVideosByUser(userId);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user videos" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/trending", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const videos = await storage.getTrendingVideos(limit);
      
      // Add user information to each video
      const videosWithUsers = await Promise.all(
        videos.map(async (video) => {
          const user = await storage.getUser(video.userId!);
          return {
            ...video,
            user: user ? { ...user, password: undefined } : null,
          };
        })
      );
      
      res.json(videosWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending videos" });
    }
  });

  app.get("/api/admin/creators", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const creators = await storage.getTopCreators(limit);
      res.json(creators.map(user => ({ ...user, password: undefined })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top creators" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
