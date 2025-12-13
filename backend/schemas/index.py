from pydantic import BaseModel
from typing import List
from datetime import datetime

class ActionItem(BaseModel):
    id: str
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
    date: str

class CreatedMeeting(MeetingSummary):
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

class MeetingReport(BaseModel):
    total_meetings: dict[str, int]
    total_hours: dict[str, float]
    action_items_completed: dict[str, int]
    action_items_in_progress: dict[str, int]
    action_items_pending: dict[str, int]
    total_action_items: dict[str, int]