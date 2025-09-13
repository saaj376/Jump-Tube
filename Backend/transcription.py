import subprocess
from faster_whisper import WhisperModel
import numpy as np
import time
import math

class YoutubeTranscriber:
    def __init__(self, model_size="tiny.en"):
        print("Loading model: ",model_size)
        self.model=WhisperModel(model_size,device="cpu",compute_type="int8")
        print("Model loaded Successfully")

    def getaudiourl(self, youtube_url):
        yt_process=subprocess.Popen(
            ['yt-dlp','-f','bestaudio','-g',youtube_url],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        audio_url,yt_err=yt_process.communicate()
        if yt_err:
            raise RuntimeError("Error getting Audio URL")
        return audio_url.strip()
    
    def processaudiostream(self, audio_url):
        ffmpeg_command = [
            'ffmpeg',
            '-i', audio_url,
            '-f', 's16le',
            '-ac', '1',
            '-ar', '16000',
            'pipe:1'
        ]
        ffmpeg_process = subprocess.Popen(ffmpeg_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        audio_bytes, _ = ffmpeg_process.communicate()
        return np.frombuffer(audio_bytes, dtype=np.int16).astype(np.float32) / 32768.0
    
    def transcribe(self, youtube_url):
        try:
            print("Starting local transcription")
            audio_url=self.getaudiourl(youtube_url)
            print("Processing the audio")
            audio_np=self.processaudiostream(audio_url)
            print("Starting transcription on the youtube video: ")
            
            starttime=time.time()
            segments,info=self.model.transcribe(audio_np,beam_size=5)
            transcript_lines = []

            for segment in segments:
                start_time = math.floor(segment.start)
                line = f"[{start_time}] {segment.text.strip()}"
                transcript_lines.append(line)
            
        
            full_transcript_with_timestamps = "\n".join(transcript_lines)
            endtime=time.time()
            totaltime=endtime-starttime
            print("Transcription finished in ",totaltime,"seconds")
            return full_transcript_with_timestamps
        
        except FileNotFoundError as e:
            print("Please make sure yt-dlp and ffmpeg are installed in your path")
        except Exception as e:
            print("Some error ma, kindly debug")