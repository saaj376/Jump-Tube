import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoSidebar } from "@/components/VideoSidebar";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button"; 
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Clock, 
  FileText, 
  Zap, 
  Youtube, 
  Sparkles,
  Loader2,
  ArrowRight,
  ExternalLink,
  Menu,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, VideoInfo, SearchResponse, TimestampMatch, TimestampSearchResponse, SummarizeResponse } from "@/lib/api";

const Index = () => {
  const [searchResults, setSearchResults] = useState<VideoInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  
  // Video player state
  const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHomePage, setIsHomePage] = useState(true);
  
  // Timestamp search state
  const [timestampResults, setTimestampResults] = useState<TimestampMatch[]>([]);
  const [isTimestampSearching, setIsTimestampSearching] = useState(false);
  
  // Summarize state
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setCurrentQuery(query);
    setSelectedVideo(null); // Clear selected video on new search
    setTimestampResults([]);
    setSummary("");
    setIsHomePage(false); // Move to video player view
    
    try {
      const data = await apiService.searchVideos(query, 12);
      setSearchResults(data.results);
      
      toast({
        title: "Search completed",
        description: `Found ${data.total_results} videos for "${query}"`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Could not connect to the search service. Make sure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleGoHome = () => {
    setIsHomePage(true);
    setSearchResults([]);
    setSelectedVideo(null);
    setCurrentQuery("");
    setTimestampResults([]);
    setSummary("");
  };

  const handleVideoSelect = (video: VideoInfo) => {
    setSelectedVideo(video);
    setTimestampResults([]);
    setSummary("");
  };

  const handleTimestampSearch = async (query: string) => {
    if (!selectedVideo || !query.trim()) return;
    
    setIsTimestampSearching(true);
    
    try {
      const data = await apiService.searchTimestamps(selectedVideo.url, query, 5);
      setTimestampResults(data.matches);
      
      toast({
        title: "Timestamp search completed",
        description: `Found ${data.matches.length} relevant moments`,
      });
    } catch (error) {
      console.error('Timestamp search error:', error);
      toast({
        title: "Timestamp search failed",
        description: "Could not search within the video",
        variant: "destructive",
      });
    } finally {
      setIsTimestampSearching(false);
    }
  };

  const handleSummarize = async () => {
    if (!selectedVideo) return;
    
    setIsSummarizing(true);
    
    try {
      const data = await apiService.summarizeVideo(selectedVideo.url);
      setSummary(data.summary);
      
      toast({
        title: "Video summarized",
        description: "AI summary generated successfully",
      });
    } catch (error) {
      console.error('Summarization error:', error);
      toast({
        title: "Summarization failed",
        description: "Could not generate summary for this video",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {isHomePage ? (
        // Home Page with Centered Search
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Logo variant="text" size="md" />
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="flex-1 flex items-center justify-center px-4 py-20">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="space-y-12">
                {/* Main Title */}
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-6 mb-8">
                    <Logo variant="icon" size="xl" className="mr-2" />
                    <h1 className="text-7xl font-bold gradient-text">
                      JumpTube
                    </h1>
                  </div>
                  
                  <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    AI-powered YouTube search engine with <span className="text-primary font-semibold">timestamped results</span> and <span className="text-primary font-semibold">intelligent summaries</span>
                  </p>
                </div>

                {/* Centered Search Bar */}
                <div className="max-w-4xl mx-auto">
                  <SearchBar 
                    onSearch={handleSearch} 
                    isLoading={isSearching}
                    className="w-full text-lg py-4 px-6"
                    placeholder="Search for any topic across YouTube..."
                  />
                </div>
                
                {/* Feature Icons */}
                <div className="flex items-center justify-center gap-8 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    <span className="text-lg">Video Search</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-lg">Timestamp Search</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-lg">AI Summaries</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        // Video Player View
        <div className="min-h-screen flex flex-col">
          {/* Header with Go Back Button */}
          <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGoHome}
                    className="flex items-center gap-2 hover:bg-primary/10"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    Back to Home
                  </Button>
                  <Logo variant="text" size="md" />
                </div>
                
                <div className="flex items-center gap-4">
                  <SearchBar 
                    onSearch={handleSearch} 
                    isLoading={isSearching}
                    className="max-w-md"
                    placeholder="Search YouTube videos..."
                  />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden"
                  >
                    {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex h-[calc(100vh-80px)]">
            {/* Video Player Section */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:mr-80' : ''}`}>
              <div className="h-full p-6">
                <VideoPlayer
                  video={selectedVideo}
                  timestampResults={timestampResults}
                  isTimestampSearching={isTimestampSearching}
                  onTimestampSearch={handleTimestampSearch}
                  onSummarize={handleSummarize}
                  isSummarizing={isSummarizing}
                  summary={summary}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className={`fixed lg:relative top-20 lg:top-0 right-0 h-[calc(100vh-80px)] lg:h-full w-80 bg-background/95 backdrop-blur-md border-l transition-transform duration-300 z-30 ${
              sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
            }`}>
              <VideoSidebar
                searchResults={searchResults}
                isSearching={isSearching}
                currentQuery={currentQuery}
                onVideoSelect={handleVideoSelect}
                selectedVideo={selectedVideo}
              />
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Index;