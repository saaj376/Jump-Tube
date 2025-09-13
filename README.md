# Jump-Tube

Don't be appalled by the beautiful frontend for this project. I got the help of lovable.AI and the only contribution I did towards the frontend is tweaking the code here and there so that it worked properly. But the backend is completely my effort and my code....So cheers✌️✌️✌️


## About the Project

JumpTube is a tool that enhances your YouTube video experience with AI-powered features:

- **YouTube Video Search**: Quickly search for YouTube videos using the YouTube API.
- **Live Transcription**: Get real-time transcription of YouTube audio, even before the video finishes playing.
- **In-Video Search**: Search for keywords within a YouTube video using the generated transcription.
- **AI Video Summarization**: Summarize videos using Gemini-powered AI to get the gist without watching the whole thing.

## How does it work
 
So I've created a data preprocessing pipeline which uses ffmpeg to stream the audio into tiny whisper.en by openai even before the audio completes its playback time. The transcription is saved in the local cache and then when the search function is invoked, the user enters keywords to search within the youtube video, the keywords are located using the transcription which was earlier saved in the local pycache and then once the keyword is matched, the timmestamp from the transcription is obtained and a youtube link is created which when clicked would jump to that specific part in the video where that keyword is located. Apart from this, I've used gemini to summarize the video based on the transcription.

## Steps to install and run the code

- Clone the repository using the link "git glone https://github.com/saaj376/Jump-Tube"
- Run the backend by first navigating to the backend folder using "cd backend" and then type "python main.py"
- before all this, make sure after cloning, you create a .env file to store your gemini API key and youtube API key
- open another window in the terminal from the Jump-Tube folder and type npm run dev
- click on the link given in the terminal and you're all set.

## Future Enhancements
- To make this project production level ready, we could implement redis and celery for asynchronous task handling and faster cache results.
- Can be bundled into a chrome extension so that everyone can use

## Demo Video
[Watch the demo](https://youtu.be/WVD4m2CSuus)
