import { useState } from "react";
import { Play, Clock, Search as SearchIcon, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VideoInfo {
  video_id: string;
  title: string;
  description: string;
  url: string;
}

interface VideoCardProps {
  video: VideoInfo;
  onTimestampSearch?: (videoUrl: string) => void;
  onSummarize?: (videoUrl: string) => void;
}

export function VideoCard({ video, onTimestampSearch, onSummarize }: VideoCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const thumbnailUrl = `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`;
  const fallbackThumbnail = `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`;

  return (
    <Card className="group backdrop-glass hover:glow-card transition-smooth hover:scale-[1.02] border-border/50">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={imageError ? fallbackThumbnail : thumbnailUrl}
          alt={video.title}
          className="w-full h-48 object-cover transition-smooth group-hover:scale-105"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/70 rounded text-xs text-white">
          <Play className="h-3 w-3" />
          Video
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-smooth">
            {video.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
            {video.description}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline-glow"
            size="sm"
            onClick={() => window.open(video.url, '_blank')}
            className="flex-1 min-w-fit"
          >
            <ExternalLink className="h-4 w-4" />
            Watch
          </Button>
          
          {onTimestampSearch && (
            <Button
              variant="glass"
              size="sm"
              onClick={() => onTimestampSearch(video.url)}
              className="flex-1 min-w-fit"
            >
              <SearchIcon className="h-4 w-4" />
              Search In Video
            </Button>
          )}
          
          {onSummarize && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onSummarize(video.url)}
              className="flex-1 min-w-fit"
            >
              <FileText className="h-4 w-4" />
              Summarize
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}