from passlib.context import CryptContext
from models.User import User
from db.config import db
from models.Meeting import Meeting
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException
from schemas.index import CreatedMeeting

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(email: str):
    """Retrieves a user from the database by email."""
    user = db.User.find_one({"email": email})
    return user

def create_meeting(meeting: Meeting) -> CreatedMeeting:
    """Saves a meeting transcript and summary to the database."""
    try:
        meeting_dict = meeting.model_dump()
        result = db.Meeting.insert_one(meeting_dict)
        created_meeting = db.Meeting.find_one({"_id": result.inserted_id})
        if created_meeting:
            # Convert ObjectId to string for JSON serialization
            created_meeting["id"] = str(created_meeting["_id"])
            del created_meeting["_id"]
        return created_meeting
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
