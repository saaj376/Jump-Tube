import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { VideoCard } from "@/components/VideoCard";
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
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoInfo {
  video_id: string;
  title: string;
  description: string;
  url: string;
}

interface SearchResponse {
  query: string;
  results: VideoInfo[];
  total_results: number;
}

interface TimestampMatch {
  time: string;
  seconds: string;
  text: string;
  url: string;
}

interface TimestampSearchResponse {
  video_url: string;
  prompt: string;
  matches: TimestampMatch[];
}

interface SummarizeResponse {
  video_url: string;
  summary: string;
}

const API_BASE = "http://localhost:8000"; // Update this to match your FastAPI server

const Index = () => {
  const [searchResults, setSearchResults] = useState<VideoInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  
  // Timestamp search state
  const [timestampSearchOpen, setTimestampSearchOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [timestampQuery, setTimestampQuery] = useState("");
  const [timestampResults, setTimestampResults] = useState<TimestampMatch[]>([]);
  const [isTimestampSearching, setIsTimestampSearching] = useState(false);
  
  // Summarize state
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryVideoUrl, setSummaryVideoUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setCurrentQuery(query);
    
    try {
      const response = await fetch(`${API_BASE}/api/search?query=${encodeURIComponent(query)}&maxresults=12`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data: SearchResponse = await response.json();
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

  const handleTimestampSearch = (videoUrl: string) => {
    setSelectedVideoUrl(videoUrl);
    setTimestampSearchOpen(true);
    setTimestampResults([]);
    setTimestampQuery("");
  };

  const performTimestampSearch = async () => {
    if (!timestampQuery.trim()) return;
    
    setIsTimestampSearching(true);
    
    try {
      const response = await fetch(`${API_BASE}/api/search-timestamps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_url: selectedVideoUrl,
          prompt: timestampQuery,
          top_k: 5
        }),
      });
      
      if (!response.ok) {
        throw new Error('Timestamp search failed');
      }
      
      const data: TimestampSearchResponse = await response.json();
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

  const handleSummarize = (videoUrl: string) => {
    setSummaryVideoUrl(videoUrl);
    setSummaryOpen(true);
    setSummary("");
  };

  const performSummarize = async () => {
    setIsSummarizing(true);
    
    try {
      const response = await fetch(`${API_BASE}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_url: summaryVideoUrl
        }),
      });
      
      if (!response.ok) {
        throw new Error('Summarization failed');
      }
      
      const data: SummarizeResponse = await response.json();
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
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-gradient-primary rounded-2xl glow-primary">
              <Youtube className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-6xl font-bold gradient-text">
              JumpTube
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            AI-powered YouTube search engine with <span className="text-primary font-semibold">timestamped results</span> and <span className="text-primary font-semibold">intelligent summaries</span>
          </p>
          
          <SearchBar 
            onSearch={handleSearch} 
            isLoading={isSearching}
            className="max-w-3xl mx-auto"
            placeholder="Search for any topic across YouTube..."
          />
          
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              Video Search
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Timestamp Search
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              AI Summaries
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {(searchResults.length > 0 || isSearching) && (
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold">
                {isSearching ? "Searching..." : `Results for "${currentQuery}"`}
              </h2>
              {!isSearching && (
                <Badge variant="secondary" className="px-3 py-1">
                  {searchResults.length} videos
                </Badge>
              )}
            </div>
            
            {isSearching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="backdrop-glass shimmer h-80" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((video) => (
                  <VideoCard 
                    key={video.video_id} 
                    video={video}
                    onTimestampSearch={handleTimestampSearch}
                    onSummarize={handleSummarize}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Timestamp Search Modal */}
      {timestampSearchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="backdrop-glass max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Search Within Video
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setTimestampSearchOpen(false)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Video URL</label>
                  <Input 
                    value={selectedVideoUrl} 
                    readOnly 
                    className="backdrop-glass" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">What are you looking for?</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., 'machine learning', 'how to setup'..."
                      value={timestampQuery}
                      onChange={(e) => setTimestampQuery(e.target.value)}
                      className="backdrop-glass"
                      onKeyDown={(e) => e.key === 'Enter' && performTimestampSearch()}
                    />
                    <Button 
                      variant="electric" 
                      onClick={performTimestampSearch}
                      disabled={isTimestampSearching || !timestampQuery.trim()}
                    >
                      {isTimestampSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {timestampResults.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Found Timestamps:</h4>
                  <div className="space-y-3">
                    {timestampResults.map((match, index) => (
                      <Card key={index} className="p-4 backdrop-glass border-border/50">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-primary">
                                {match.time}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {match.seconds}s
                              </span>
                            </div>
                            <p className="text-sm">{match.text}</p>
                          </div>
                          <Button
                            variant="outline-glow"
                            size="sm"
                            onClick={() => window.open(match.url, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                            Jump
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Summary Modal */}
      {summaryOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="backdrop-glass max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Video Summary
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSummaryOpen(false)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Video URL</label>
                  <Input 
                    value={summaryVideoUrl} 
                    readOnly 
                    className="backdrop-glass" 
                  />
                </div>
                
                <Button 
                  variant="hero" 
                  onClick={performSummarize}
                  disabled={isSummarizing}
                  className="w-full"
                >
                  {isSummarizing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Summary...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Generate AI Summary
                    </>
                  )}
                </Button>
              </div>

              {summary && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Summary
                    </h4>
                    <Card className="p-4 backdrop-glass border-border/50">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {summary}
                      </p>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;