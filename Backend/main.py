from fastapi import FastAPI,HTTPException,Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from typing import Optional
import uvicorn
import warnings

# Suppress Pydantic warnings from Google API client
warnings.filterwarnings("ignore", message="Field name.*shadows an attribute in parent.*")

from youtube import YoutubeClient
from search import YoutubeSearch
from config import YOUTUBE_API_KEY,GEMINI_API_KEY,MAX_RESULTS
from summarizer import VideoSummarizer

app=FastAPI(
    title="JumpTube",
    description="A YouTube video search engine with timestamped results using Gemini API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
yt_client=YoutubeClient(YOUTUBE_API_KEY)
yt_search=YoutubeSearch(apikey=YOUTUBE_API_KEY,api_key=GEMINI_API_KEY)
video_summarizer = VideoSummarizer(api_key=GEMINI_API_KEY)

class videoinfo(BaseModel):
    video_id:str
    title:str
    description:str
    url:str
class searchresponse(BaseModel):
    query:str
    results:List[videoinfo]
    total_results:int
class invideosearchrequest(BaseModel):
    video_url:str
    prompt:str
    top_k:Optional[int]=5
class invideomatch(BaseModel):
    time:str
    seconds:str
    text:str
    url:str
class invideosearchresponse(BaseModel):
    video_url:str
    prompt:str
    matches:List[invideomatch]
class SummarizeRequest(BaseModel):
    video_url: str
class SummarizeResponse(BaseModel):
    video_url: str
    summary: str

@app.get("/health")
async def health():
    return {"status":"ok"}

@app.get("/api/search",response_model=searchresponse)
async def searchvideos(
    query:str=Query(...,description="Search term for YouTube videos"),
    maxresults:int=Query(MAX_RESULTS,description="Maximum number of results to return",le=50)
):
    try:
        if not query.strip():
            raise HTTPException(status_code=400,detail="Query cannot be empty")
        videos=yt_client.search(query,maxresults)
        items:List[videoinfo] = []
        for v in videos:
            items.append(videoinfo(
                video_id=v["video_id"],
                title=v["title"],
                description=v["description"],
                url=f"https://youtu.be/{v['video_id']}"
            ))
        return searchresponse(query=query,results=items,total_results=len(items))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {e}")
    

@app.post("/api/invideo_search",response_model=invideosearchresponse)
async def invideosearch(request:invideosearchrequest):
    try:
        if not request.video_url.strip():
            raise HTTPException(status_code=400,detail="Video URL cannot be empty")
        if not request.prompt.strip():
            raise HTTPException(status_code=400,detail="Prompt cannot be empty")
        matches=yt_search.search_timestamps(request.video_url,request.prompt,request.top_k)
        return invideosearchresponse(
            video_url=request.video_url,
            prompt=request.prompt,
            matches=[invideomatch(**m) for m in matches]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"In-video search failed: {e}")

@app.post("/api/summarize",response_model=SummarizeResponse)
async def summarize_video(request:SummarizeRequest):
    try:
        if not request.video_url.strip():
            raise HTTPException(status_code=400,detail="Video URL cannot be empty")
        summary=video_summarizer.summarize(request.video_url)
        return SummarizeResponse(video_url=request.video_url,summary=summary)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video summarization failed: {e}")
    
if __name__=="__main__":
    uvicorn.run('main:app',host="0.0.0.0",port=8000,reload=True)