from fastapi import APIRouter
from llm import call_chain
from models.Meeting import Meeting
from services.index import create_meeting
from datetime import datetime

router = APIRouter()

@router.get('/')
async def root():
    return {"message": "Hello World"}

@router.post('/upload-meeting')
async def upload_meeting(transcript_content: str):
    """Accepts a meeting transcript and returns a structured summary."""
    summary_dict = call_chain(transcript_content) # Pass the plain string directly to call_chain

    try:
        # Create a Meeting model instance
        meeting_data = Meeting(
            summary=summary_dict.summary,
            action_items=summary_dict.action_items,
            key_points=summary_dict.key_points,
            participants=summary_dict.participants,
            date=datetime.now(),
            duration=summary_dict.duration,
            title=summary_dict.title,
            user_id='user123',
            status='completed',
            start_time=summary_dict.start_time,
            end_time=summary_dict.end_time
        )

        # Save the meeting to the database
        created_meeting = create_meeting(meeting_data)

        if created_meeting:
            # Return the created meeting with a success message
            return {"message": "Meeting saved successfully", "success": True, "data": created_meeting}
        else:
            return {"error": "Failed to create and retrieve meeting", "success": False}
    except Exception as e:
        return {"error": str(e)}
