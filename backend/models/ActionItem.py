from pydantic import BaseModel
from datetime import datetime


class ActionItem(BaseModel):
    meeting_id: str
    status: str         # e.g., "pending", "completed", "in-progress"
    description: str
    assigned_to: str
    due_date: datetime
    priority: str  # e.g., "low", "medium", "high"