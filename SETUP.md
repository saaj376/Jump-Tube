# JumpTube Setup Guide

## Prerequisites

1. **Python 3.8+** installed
2. **Node.js 16+** installed  
3. **FFmpeg** installed (for audio processing)
4. **yt-dlp** installed (for YouTube audio extraction)

## Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Install system dependencies:
   ```bash
   # On Windows (using chocolatey)
   choco install ffmpeg
   
   # On macOS (using homebrew)
   brew install ffmpeg
   
   # On Ubuntu/Debian
   sudo apt update
   sudo apt install ffmpeg
   ```

4. Install yt-dlp:
   ```bash
   pip install yt-dlp
   ```

5. Create a `.env` file in the Backend directory:
   ```bash
   cp env.example .env
   ```

6. Edit `.env` and add your API keys:
   - Get YouTube API key from: https://console.developers.google.com/
   - Get Gemini API key from: https://makersuite.google.com/app/apikey

7. Start the backend server:
   ```bash
   python main.py
   ```

## Frontend Setup

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Quick Start

Use the provided batch file to start both servers:
```bash
start-dev.bat
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/search?query={query}&maxresults={number}` - Search YouTube videos
- `POST /api/invideo_search` - Search within video timestamps
- `POST /api/summarize` - Generate video summaries

## Troubleshooting

1. **Backend won't start**: Check that all dependencies are installed and API keys are set
2. **Frontend can't connect**: Ensure backend is running on port 8000
3. **Transcription fails**: Make sure FFmpeg and yt-dlp are installed and accessible
4. **Search fails**: Verify your YouTube API key is valid and has quota remaining
