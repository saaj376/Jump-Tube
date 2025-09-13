from google import genai
from transcription import YoutubeTranscriber
import re
from youtube import YoutubeClient
from typing import List, Dict, Optional, Tuple


class YoutubeSearch:
    def __init__(self, apikey: str, api_key: str):
        self.youtube = YoutubeClient(apikey)
        self.gemini = genai.Client(api_key=api_key)
        self.transcriber = YoutubeTranscriber(model_size="tiny.en")
        self.transcript_cache = {}

    def gettranscript(self, video_url: str) -> Optional[str]:
        if video_url in self.transcript_cache:
            print("Using cached transcript")
            return self.transcript_cache[video_url]
        try:
            print("Getting transcript for the first time...")
            transcript = self.transcriber.transcribe(video_url)
            if transcript:
                self.transcript_cache[video_url] = transcript
            return transcript
        except Exception as e:
            print(f"Error getting transcript: {e}")
            return None

    def _parse_transcript(self, transcript_text: str) -> List[Tuple[int, str]]:
        parsed: List[Tuple[int, str]] = []
        if not transcript_text:
            return parsed
        
        for line in transcript_text.splitlines():
            match = re.match(r"^\[(\d+)\]\s*(.*)$", line.strip())
            if match:
                seconds = int(match.group(1))
                text = match.group(2).strip()
                if text:
                    parsed.append((seconds, text))
        return parsed

    def _score_line(self, text: str, keywords: List[str]) -> int:
        score = 0
        lt = text.lower()
        for kw in keywords:
            if kw and kw in lt:
                score += 1
        return score

    def _extract_keywords(self, prompt: str) -> List[str]:
        tokens = re.findall(r"[a-zA-Z0-9]+", prompt.lower())
        long_tokens = [t for t in tokens if len(t) >= 3]
        return long_tokens if long_tokens else tokens

    def build_timestamp_link(self, video_url: str, seconds: int) -> str:
        if "youtu.be/" in video_url:
            sep = "&" if "?" in video_url else "?"
            return f"{video_url}{sep}t={seconds}s"
        if "watch?v=" in video_url:
            sep = "&" if "?" in video_url else "?"
            return f"{video_url}{sep}t={seconds}s"
        sep = "&" if "?" in video_url else "?"
        return f"{video_url}{sep}t={seconds}s"

    def search_timestamps(self, video_url: str, prompt: str, top_k: int = 5) -> List[Dict[str, str]]:
        transcript_text = self.gettranscript(video_url)
        if not transcript_text:
            return []

        parsed = self._parse_transcript(transcript_text)
        if not parsed:
            return []

        keywords = self._extract_keywords(prompt)
        if not keywords:
            return []

        scored: List[Tuple[int, int, str]] = []
        
        for seconds, text in parsed:
            score = self._score_line(text, keywords)
            if score > 0:
                scored.append((score, seconds, text))

        if not scored:
            return []

        scored.sort(key=lambda x: (-x[0], x[1]))
        if top_k > 0:
            scored = scored[:top_k]

        def fmt_time(s: int) -> str:
            m = s // 60
            sec = s % 60
            return f"{m:02d}:{sec:02d}"

        results: List[Dict[str, str]] = []
        for score, seconds, text in scored:
            url = self.build_timestamp_link(video_url, seconds)
            results.append({
                "time": fmt_time(seconds),
                "seconds": str(seconds),
                "text": text,
                "url": url
            })
        
        return results

    def search_and_link(self, query: str, maxresults: int = 20) -> List[Dict[str, str]]:
        return self.youtube.search(query, maxresults)