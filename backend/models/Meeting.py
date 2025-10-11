from pydantic import BaseModel
from datetime import datetime

class Meeting(BaseModel):
    user_id: str
    title: str
    date: datetime
    participants: list[str]
    duration: int  # duration in minutes
    summary: str
    status: str  # e.g., "scheduled", "completed", "canceled"
