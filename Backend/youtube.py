from googleapiclient.discovery import build

class YoutubeClient:
    def __init__(self,apikey:str):
        self.apikey=apikey
        self.servicename="youtube"
        self.version="v3"
        self.youtube=build(self.servicename,self.version,developerKey=self.apikey)
    
    def search(self,query:str,maxresults:int=20):
        request = self.youtube.search().list(
            q=query,
            part="snippet",
            maxResults=maxresults,
            type="video"
        )
        response=request.execute()
        results=[]
        for i in response.get("items",[]):
            results.append({
                "video_id":i["id"]["videoId"],
                "title":i["snippet"]["title"],
                "description":i["snippet"]["description"]
            })
        return results
    