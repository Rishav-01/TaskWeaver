from passlib.context import CryptContext
from db.config import user_collection, meeting_collection
from models.Meeting import Meeting
from fastapi import HTTPException
from bson.objectid import ObjectId
from datetime import datetime
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
    """Retrieves all meetings for a specific user and return the meetings in descending order of their creation"""
    try:
        meetings_cursor = meeting_collection.find({"user_id": user_email})
        meetings = []
        for meeting in meetings_cursor:
            meeting["id"] = str(meeting["_id"])
            del meeting["_id"]
            meetings.append(meeting)

        # Sort meetings in descending order of their creation time
        meetings.sort(key=lambda x: x["date"], reverse=True)
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
    
def get_meeting_report(user_email: str, start_date: datetime, end_date: datetime):
    """Retrieves and aggregates report data of meetings for a specific user."""
    try:
        query = {
            "user_id": user_email,
            "created_time": {"$gte": start_date, "$lte": end_date}
        }

        meetings_cursor = meeting_collection.find(query)
        total_meetings = 0
        total_duration = 0
        action_items_completed = 0
        meetings_list = list(meetings_cursor)
        total_meetings = len(meetings_list)

        for meeting in meetings_list:
            total_duration += meeting["duration"]
            if "action_items" in meeting:
                for item in meeting["action_items"]:
                    if item.get("status") == "completed":
                        action_items_completed += 1

        return {
            "total_meetings": total_meetings,
            "meeting_hours": round(total_duration / 60, 2),
            "action_items_completed": action_items_completed
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def update_action_items(meeting_id: str, updated_action_items: list[dict]):
    """Updates action items for a specific meeting."""
    try:
        obj_id = ObjectId(meeting_id)
        update_result = meeting_collection.update_one(
            {"_id": obj_id},
            {"$set": {"action_items": updated_action_items}}
        )
        if update_result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Meeting not found or no changes made.")
        updated_meeting = meeting_collection.find_one({"_id": obj_id})
        if updated_meeting:
            updated_meeting["id"] = str(updated_meeting["_id"])
            del updated_meeting["_id"]
        return updated_meeting
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))