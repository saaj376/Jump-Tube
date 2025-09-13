const API_BASE = "http://localhost:8000";

export interface VideoInfo {
  video_id: string;
  title: string;
  description: string;
  url: string;
}

export interface SearchResponse {
  query: string;
  results: VideoInfo[];
  total_results: number;
}

export interface TimestampMatch {
  time: string;
  seconds: string;
  text: string;
  url: string;
}

export interface TimestampSearchResponse {
  video_url: string;
  prompt: string;
  matches: TimestampMatch[];
}

export interface SummarizeResponse {
  video_url: string;
  summary: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return response.json();
  }

  async searchVideos(query: string, maxResults: number = 12): Promise<SearchResponse> {
    const response = await fetch(
      `${this.baseUrl}/api/search?query=${encodeURIComponent(query)}&maxresults=${maxResults}`
    );
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  async searchTimestamps(
    videoUrl: string, 
    prompt: string, 
    topK: number = 5
  ): Promise<TimestampSearchResponse> {
    const response = await fetch(`${this.baseUrl}/api/invideo_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_url: videoUrl,
        prompt: prompt,
        top_k: topK
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Timestamp search failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  async summarizeVideo(videoUrl: string): Promise<SummarizeResponse> {
    const response = await fetch(`${this.baseUrl}/api/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_url: videoUrl
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Summarization failed: ${response.statusText}`);
    }
    
    return response.json();
  }
}

export const apiService = new ApiService();
export default apiService;
