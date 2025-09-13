import { VideoCard } from "@/components/VideoCard";
import { VideoInfo } from "@/lib/api";
import { Search, Clock, FileText } from "lucide-react";

interface VideoSidebarProps {
  searchResults: VideoInfo[];
  isSearching: boolean;
  currentQuery: string;
  onVideoSelect: (video: VideoInfo) => void;
  selectedVideo: VideoInfo | null;
}

export const VideoSidebar = ({ 
  searchResults, 
  isSearching, 
  currentQuery, 
  onVideoSelect, 
  selectedVideo 
}: VideoSidebarProps) => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <Search className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">
            {isSearching ? "Searching..." : `Results for "${currentQuery}"`}
          </h2>
        </div>
        {!isSearching && searchResults.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {searchResults.length} videos found
          </p>
        )}
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {isSearching ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-32 mb-3" />
                <div className="space-y-2">
                  <div className="bg-muted h-4 rounded w-3/4" />
                  <div className="bg-muted h-3 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((video) => (
              <div
                key={video.video_id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedVideo?.video_id === video.video_id
                    ? 'ring-2 ring-primary rounded-lg'
                    : 'hover:bg-muted/50 rounded-lg'
                }`}
                onClick={() => onVideoSelect(video)}
              >
                <VideoCard 
                  video={video}
                  onTimestampSearch={() => {}} // Handled in parent
                  onSummarize={() => {}} // Handled in parent
                  isSelected={selectedVideo?.video_id === video.video_id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Search for videos to get started
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t bg-muted/20">
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Search className="h-3 w-3" />
            Search
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Timestamps
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            AI Summary
          </div>
        </div>
      </div>
    </div>
  );
};
