# JumpTube - AI-Powered YouTube Search Engine

A modern, beautiful frontend for searching YouTube videos with AI-powered timestamped results and intelligent summaries.

## ✨ Features

- **🔍 Smart Search**: Search across millions of YouTube videos
- **⏰ Timestamp Search**: Find specific moments within videos using AI
- **📝 AI Summaries**: Get intelligent video summaries powered by Gemini AI
- **🎨 Beautiful UI**: Modern dark theme with smooth animations
- **📱 Responsive**: Works perfectly on desktop and mobile

## 🚀 Getting Started

### Prerequisites

Make sure you have the backend running first. The backend should be available at `http://localhost:8000`.

### Frontend Setup

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:8080`.

### Backend Setup

The frontend expects the following API endpoints to be available:

- `GET /api/search` - Search YouTube videos
- `POST /api/search-timestamps` - Search within video timestamps
- `POST /api/summarize` - Generate AI video summaries
- `GET /health` - Health check

Make sure your FastAPI backend is running with these endpoints.

## 🎯 API Configuration

Update the `API_BASE` constant in `src/pages/Index.tsx` if your backend is running on a different URL:

```typescript
const API_BASE = "http://localhost:8000"; // Change this to match your backend
```

## 🛠 Built With

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Shadcn/ui** - UI components
- **Lucide React** - Icons
- **React Router** - Navigation

## 🎨 Design System

The app uses a custom design system with:
- **Dark theme** with electric blue/purple gradients
- **Glassmorphism** effects
- **Smooth animations** and transitions
- **Responsive design** for all screen sizes
- **Accessibility** features built-in

## 📱 Screenshots

### Hero Section
- Clean search interface with gradient backgrounds
- AI-powered search suggestions
- Beautiful loading states

### Search Results
- Card-based video layout
- Thumbnail previews
- Action buttons for each video

### Timestamp Search
- Modal interface for searching within videos
- Highlighted timestamp results
- Direct links to video moments

### AI Summaries
- Clean summary presentation
- Powered by Gemini AI
- Easy to read format

## 🔧 Customization

### Changing Colors
Update the color palette in `src/index.css`:

```css
:root {
  --primary: 225 80% 60%;        /* Electric blue */
  --primary-glow: 225 100% 70%;  /* Brighter blue */
  --secondary: 260 60% 18%;      /* Purple accent */
}
```

### Adding New Features
1. Create components in `src/components/`
2. Add new pages to `src/pages/`
3. Update routing in `src/App.tsx`

## 📄 License

This project is part of the JumpTube YouTube search engine system.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Note**: Make sure the backend is running before starting the frontend. The app will show connection errors if the API is not available.