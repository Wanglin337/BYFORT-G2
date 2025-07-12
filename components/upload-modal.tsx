import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCreateVideo } from "@/hooks/use-videos";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CloudUpload, Film, Hash, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { user } = useAuth();
  const { mutate: createVideo, isPending } = useCreateVideo();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    tags: "",
  });

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.videoUrl.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide at least a title and video URL",
        variant: "destructive",
      });
      return;
    }

    const tags = formData.tags
      .split(",")
      .map(tag => tag.trim().replace(/^#/, ""))
      .filter(tag => tag.length > 0);

    try {
      await createVideo({
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        thumbnailUrl: formData.thumbnailUrl || undefined,
        tags,
      });
      
      // Reset form and close modal
      setFormData({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        tags: "",
      });
      setUploadProgress(0);
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file",
        variant: "destructive",
      });
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // In a real app, you would upload to Firebase Storage or similar
    const mockUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, videoUrl: mockUrl }));
    
    toast({
      title: "File uploaded!",
      description: "Video file ready for publishing",
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      tags: "",
    });
    setUploadProgress(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-[var(--byfort-dark)] border-[var(--byfort-gray)] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center gap-2">
              <Film className="w-6 h-6 text-[var(--byfort-pink)]" />
              Upload Video
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload Area */}
          <div className="space-y-2">
            <Label className="text-white">Video File</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-[var(--byfort-cyan)] bg-[var(--byfort-cyan)]/10'
                  : 'border-[var(--byfort-gray)] hover:border-[var(--byfort-cyan)]'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CloudUpload className="w-12 h-12 text-[var(--byfort-cyan)] mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Drag and drop your video here</p>
              <p className="text-sm text-gray-500 mb-4">or click to browse</p>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <Button
                type="button"
                variant="outline"
                className="border-[var(--byfort-gray)] text-white hover:bg-[var(--byfort-gray)]"
                onClick={() => document.getElementById('video-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Uploading...</span>
                  <span className="text-[var(--byfort-cyan)]">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>

          {/* Video URL Alternative */}
          <div className="space-y-2">
            <Label className="text-white">Or Video URL</Label>
            <Input
              type="url"
              placeholder="https://example.com/video.mp4"
              value={formData.videoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
              className="bg-[var(--byfort-gray)] border-[var(--byfort-light-gray)] text-white placeholder-gray-400"
            />
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-2">
            <Label className="text-white">Thumbnail URL (Optional)</Label>
            <Input
              type="url"
              placeholder="https://example.com/thumbnail.jpg"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
              className="bg-[var(--byfort-gray)] border-[var(--byfort-light-gray)] text-white placeholder-gray-400"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label className="text-white">Title *</Label>
            <Input
              type="text"
              placeholder="Give your video a catchy title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-[var(--byfort-gray)] border-[var(--byfort-light-gray)] text-white placeholder-gray-400"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-white">Description</Label>
            <Textarea
              placeholder="Tell us about your video..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-[var(--byfort-gray)] border-[var(--byfort-light-gray)] text-white placeholder-gray-400 min-h-[100px]"
              rows={4}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Tags
            </Label>
            <Input
              type="text"
              placeholder="dance, trending, viral (separate with commas)"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="bg-[var(--byfort-gray)] border-[var(--byfort-light-gray)] text-white placeholder-gray-400"
            />
            <p className="text-xs text-gray-500">
              Use relevant hashtags to help people discover your video
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isPending || !formData.title.trim() || !formData.videoUrl.trim()}
              className="flex-1 bg-[var(--byfort-pink)] hover:bg-[var(--byfort-pink)]/80 text-white"
            >
              {isPending ? (
                "Publishing..."
              ) : (
                <>
                  <CloudUpload className="w-4 h-4 mr-2" />
                  Publish Video
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-[var(--byfort-gray)] text-white hover:bg-[var(--byfort-gray)]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
