from fastapi import APIRouter
from schemas.index import MeetingSummary # Import MeetingSummary for response_model
from llm import call_chain
from models.Meeting import Meeting
from services.index import create_meeting

router = APIRouter()

@router.get('/')
async def root():
    return {"message": "Hello World"}

@router.post('/upload-meeting', response_model=MeetingSummary) # Add response_model for better API documentation and validation
async def upload_meeting(transcript_content: str): # Change parameter type to str to accept plain text body
    """Accepts a meeting transcript and returns a structured summary."""
    summary_dict = call_chain(transcript_content) # Pass the plain string directly to call_chain

    # Create a Meeting model instance
    meeting_data = Meeting(
        transcript=summary_dict.summary,
        summary=summary_dict.summary,
        action_items=summary_dict.action_items,
        date='2023-10-01T10:00:00',
        duration=60,
        participants=summary_dict.participants,
        title=summary_dict.title,
        user_id='user123',
        status='completed'
    )
    # Save the meeting data to the database
    try:
        create_meeting(meeting_data)
        print("Meeting saved successfully")
    except Exception as e:
        return {"error": str(e)}

    return summary_dict