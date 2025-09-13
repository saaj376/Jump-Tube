import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Clock, 
  FileText, 
  Search,
  ExternalLink,
  Loader2
} from "lucide-react";
import { VideoInfo, TimestampMatch } from "@/lib/api";

interface VideoPlayerProps {
  video: VideoInfo | null;
  timestampResults: TimestampMatch[];
  isTimestampSearching: boolean;
  onTimestampSearch: (query: string) => void;
  onSummarize: () => void;
  isSummarizing: boolean;
  summary: string;
}

export const VideoPlayer = ({ 
  video, 
  timestampResults, 
  isTimestampSearching, 
  onTimestampSearch, 
  onSummarize, 
  isSummarizing, 
  summary 
}: VideoPlayerProps) => {
  const [timestampQuery, setTimestampQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = video ? getVideoId(video.url) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}` : null;

  const handleTimestampClick = (timestamp: TimestampMatch) => {
    if (videoId) {
      const seconds = parseInt(timestamp.seconds);
      const newUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&start=${seconds}`;
      // Update the iframe src to jump to the timestamp
      const iframe = document.getElementById('youtube-player') as HTMLIFrameElement;
      if (iframe) {
        iframe.src = newUrl;
      }
    }
  };

  const handleTimestampSearch = () => {
    if (timestampQuery.trim()) {
      onTimestampSearch(timestampQuery);
    }
  };

  if (!video) {
    return (
      <div className="w-full h-96 bg-muted/20 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a video to start watching</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Video Player */}
      <div className="relative w-full">
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
          {embedUrl ? (
            <iframe
              id="youtube-player"
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">Unable to load video</p>
            </div>
          )}
        </div>
      </div>

      {/* Video Info */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
          <p className="text-muted-foreground line-clamp-3">{video.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => window.open(video.url, '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Watch on YouTube
          </Button>
          <Button
            variant="outline"
            onClick={onSummarize}
            disabled={isSummarizing}
            className="flex items-center gap-2"
          >
            {isSummarizing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            {isSummarizing ? "Summarizing..." : "AI Summary"}
          </Button>
        </div>
      </div>

      {/* Timestamp Search */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Search Within Video</h3>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for specific moments in this video..."
              value={timestampQuery}
              onChange={(e) => setTimestampQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTimestampSearch()}
              className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button 
              onClick={handleTimestampSearch}
              disabled={isTimestampSearching || !timestampQuery.trim()}
              className="flex items-center gap-2"
            >
              {isTimestampSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
          </div>

          {/* Timestamp Results */}
          {timestampResults.length > 0 && (
            <div className="space-y-3">
              <Separator />
              <h4 className="font-semibold text-sm">Found Moments:</h4>
              <div className="space-y-2">
                {timestampResults.map((match, index) => (
                  <Card 
                    key={index} 
                    className="p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleTimestampClick(match)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-primary">
                          {match.time}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {match.seconds}s
                        </span>
                      </div>
                      <p className="text-sm flex-1 line-clamp-2">{match.text}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0"
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* AI Summary */}
      {summary && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">AI Summary</h3>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
