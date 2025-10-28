from pydantic import BaseModel
from typing import List
from datetime import datetime

class ActionItem(BaseModel):
    status: str         # e.g., "pending", "completed", "in-progress"
    description: str
    assigned_to: str
    due_date: str
    priority: str  # e.g., "low", "medium", "high"

class MeetingSummary(BaseModel):
    title: str
    summary: str
    action_items: List[ActionItem]
    key_points: List[str]
    participants: List[str]
    duration: int  # in minutes
    start_time: str
    end_time: str

class CreatedMeeting(BaseModel):
    id: str
    title: str
    summary: str
    action_items: List[ActionItem]
    key_points: List[str]
    participants: List[str]
    date: datetime
    duration: int
    user_id: str
    status: str         # pending, in-progress, completed

class CreatedUserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str

class Token(BaseModel):
    token: str
    token_type: str

class UserLoginModel(BaseModel):
    email: str
    password: str