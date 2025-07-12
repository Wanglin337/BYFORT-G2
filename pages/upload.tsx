import { useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, Music, Sparkles, Tag, Users, Globe, Lock, X, Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateVideo } from "@/hooks/use-videos";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "wouter";

export default function UploadPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { mutate: createVideo, isPending } = useCreateVideo();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    privacy: "public",
    allowComments: true,
    allowDuet: true,
    allowStitch: true,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast({
        title: "No video selected",
        description: "Please select a video file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your video",
        variant: "destructive",
      });
      return;
    }

    try {
      // For now, we'll create a video with placeholder URL
      // In a real app, you'd upload the file to cloud storage first
      const videoUrl = URL.createObjectURL(videoFile);
      
      createVideo({
        title: formData.title,
        description: formData.description,
        videoUrl,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        isPublic: formData.privacy === "public",
      });

      toast({
        title: "Video uploaded successfully!",
        description: "Your video is now live",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        tags: "",
        privacy: "public",
        allowComments: true,
        allowDuet: true,
        allowStitch: true,
      });
      handleRemoveVideo();
      
      // Navigate to home
      setLocation("/");
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your video",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--byfort-dark)]">
        <div className="text-center">
          <h1 className="text-white text-xl mb-4">Please log in to upload videos</h1>
          <Button onClick={() => setLocation("/")}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[var(--byfort-dark)] text-white ${isMobile ? 'pb-20' : 'pt-16'}`}>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Upload Video</h1>
          <Button variant="ghost" onClick={() => setLocation("/")}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="bg-[var(--byfort-gray)] border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Select Video
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!videoPreview ? (
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-[var(--byfort-pink)] rounded-full flex items-center justify-center">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium mb-2">Select video to upload</p>
                      <p className="text-gray-400 text-sm mb-4">Or drag and drop a file</p>
                      <div className="flex flex-col gap-2 text-xs text-gray-400">
                        <p>MP4 or WebM</p>
                        <p>720x1280 resolution or higher</p>
                        <p>Up to 60 seconds</p>
                        <p>Less than 2GB</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[var(--byfort-pink)] hover:bg-[var(--byfort-pink)]/80"
                    >
                      Select File
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={videoPreview}
                    className="w-full aspect-[9/16] bg-black rounded-lg object-cover"
                    onEnded={() => setIsPlaying(false)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      onClick={handlePlayPause}
                      variant="ghost"
                      size="icon"
                      className="w-16 h-16 bg-black/50 hover:bg-black/70 rounded-full text-white"
                    >
                      {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      onClick={handleRemoveVideo}
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Details Section */}
          <Card className="bg-[var(--byfort-gray)] border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Describe your video"
                    className="bg-[var(--byfort-dark)] border-gray-600 text-white"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-400 mt-1">{formData.title.length}/100</p>
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tell viewers about your video"
                    className="bg-[var(--byfort-dark)] border-gray-600 text-white"
                    rows={3}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-400 mt-1">{formData.description.length}/500</p>
                </div>

                <div>
                  <Label htmlFor="tags" className="text-white flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="Add tags separated by commas"
                    className="bg-[var(--byfort-dark)] border-gray-600 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">Help people find your video</p>
                </div>

                <div>
                  <Label className="text-white">Privacy</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant={formData.privacy === "public" ? "default" : "outline"}
                      size="sm"
                      className={formData.privacy === "public" ? "bg-[var(--byfort-pink)]" : "border-gray-600 text-white"}
                      onClick={() => setFormData({...formData, privacy: "public"})}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Public
                    </Button>
                    <Button
                      type="button"
                      variant={formData.privacy === "private" ? "default" : "outline"}
                      size="sm"
                      className={formData.privacy === "private" ? "bg-[var(--byfort-pink)]" : "border-gray-600 text-white"}
                      onClick={() => setFormData({...formData, privacy: "private"})}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Private
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Allow Interactions</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.allowComments}
                        onChange={(e) => setFormData({...formData, allowComments: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-300">Allow comments</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.allowDuet}
                        onChange={(e) => setFormData({...formData, allowDuet: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-300">Allow duet</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.allowStitch}
                        onChange={(e) => setFormData({...formData, allowStitch: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-300">Allow stitch</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-gray-600 text-white"
                    onClick={() => setLocation("/")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !videoFile}
                    className="flex-1 bg-[var(--byfort-pink)] hover:bg-[var(--byfort-pink)]/80"
                  >
                    {isPending ? "Uploading..." : "Post"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}