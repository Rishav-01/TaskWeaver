from passlib.context import CryptContext
from models.User import User
from db.config import db
from models.Meeting import Meeting
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException

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

def create_meeting(meeting: Meeting):
    """Saves a meeting transcript and summary to the database."""
    meeting_dict = meeting.dict()
    db.Meeting.insert_one(meeting_dict)
    return {"message": "Meeting saved successfully"}
