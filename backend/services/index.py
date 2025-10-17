from passlib.context import CryptContext
from models.User import User
from db.config import db
from models.Meeting import Meeting
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException
from schemas.index import CreatedMeeting

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(user: User):
    """Hashes the user's password and saves them to the database."""
    hashed_password = pwd_context.hash(user.password)
    user_dict = user.dict()
    user_dict['password'] = hashed_password
    
    try:
        db.User.insert_one(user_dict)
        return {"message": "User created successfully"}
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Email already registered")

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
