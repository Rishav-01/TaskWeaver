from fastapi import APIRouter
from schemas.index import MeetingTranscript, MeetingSummary # Import MeetingSummary for response_model
from llm import call_chain

router = APIRouter()

@router.get('/')
async def root():
    return {"message": "Hello World"}

@router.post('/upload-meeting', response_model=MeetingSummary) # Add response_model for better API documentation and validation
async def upload_meeting(transcript_content: str): # Change parameter type to str to accept plain text body
    """Accepts a meeting transcript and returns a structured summary."""
    print("Received transcript:", transcript_content) # Log the received content
    summary_object = call_chain(transcript_content) # Pass the plain string directly to call_chain
    return summary_object