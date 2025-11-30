from pydantic import BaseModel, Field
from datetime import datetime, timezone
from schemas.index import ActionItem
from typing import List

class Meeting(BaseModel):
    user_id: str
    title: str
    date: str
    participants: list[str]
    duration: int  # duration in minutes
    summary: str
    status: str  # e.g., "scheduled", "completed", "canceled"
    action_items: List[ActionItem]
    key_points: List[str]
    start_time: str
    end_time: str
    created_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
