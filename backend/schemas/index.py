from pydantic import BaseModel
from typing import List

class MeetingTranscript(BaseModel):
    transcript: str

class MeetingSummary(BaseModel):
    title: str
    summary: str
    action_items: List[str]
    key_points: List[str]
    participants: List[str]