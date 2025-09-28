from fastapi import FastAPI
from pydantic import BaseModel
from llm import call_chain, MeetingSummary

app = FastAPI()

class MeetingTranscript(BaseModel):
    transcript: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/upload-meeting", response_model=MeetingSummary)
async def upload_meeting(meeting: MeetingTranscript):
    """Accepts a meeting transcript and returns a structured summary."""
    summary_object = call_chain(meeting.transcript)
    return summary_object