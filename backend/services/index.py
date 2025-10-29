from passlib.context import CryptContext
from db.config import user_collection, meeting_collection
from models.Meeting import Meeting
from fastapi import HTTPException
from bson.objectid import ObjectId
from schemas.index import CreatedMeeting

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(email: str):
    """Retrieves a user from the database by email."""
    user = user_collection.find_one({"email": email})
    return user

def create_meeting(meeting: Meeting) -> CreatedMeeting:
    """Saves a meeting transcript and summary to the database."""
    try:
        meeting_dict = meeting.model_dump()
        result = meeting_collection.insert_one(meeting_dict)
        created_meeting = meeting_collection.find_one({"_id": result.inserted_id})
        if created_meeting:
            # Convert ObjectId to string for JSON serialization
            created_meeting["id"] = str(created_meeting["_id"])
            del created_meeting["_id"]
        return created_meeting
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_meetings_by_user(user_email: str) ->list[CreatedMeeting]:
    """Retrieves all meetings for a specific user."""
    try:
        meetings_cursor = meeting_collection.find({"user_id": user_email})
        meetings = []
        for meeting in meetings_cursor:
            meeting["id"] = str(meeting["_id"])
            del meeting["_id"]
            meetings.append(meeting)
        return meetings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_meeting_by_id(meeting_id: str) -> CreatedMeeting:
    """Retrieves a specific meeting by its ID."""
    try:
        # Convert the string ID to a MongoDB ObjectId
        obj_id = ObjectId(meeting_id)
        meeting = meeting_collection.find_one({"_id": obj_id})
        if meeting:
            meeting["id"] = str(meeting["_id"])
            del meeting["_id"]
        return meeting
    except Exception as e: # Catches invalid ObjectId format and other errors
        raise HTTPException(status_code=500, detail=str(e))