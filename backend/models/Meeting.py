from pydantic import BaseModel
from datetime import datetime
from schemas.index import ActionItem
from typing import List

class Meeting(BaseModel):
    user_id: str
    title: str
    date: datetime
    participants: list[str]
    duration: int  # duration in minutes
    summary: str
    status: str  # e.g., "scheduled", "completed", "canceled"
    action_items: List[ActionItem]
    key_points: List[str]
    start_time: str
    end_time: str
