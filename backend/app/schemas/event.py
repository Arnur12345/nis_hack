from pydantic import BaseModel
from datetime import datetime


class EventResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    latitude: float
    longitude: float
    address: str
    start_time: str
    end_time: str | None = None
    xp_reward: int
    max_participants: int | None = None
    image_url: str | None = None
    participants_count: int = 0
    is_joined: bool = False
    is_completed: bool = False


class EventListResponse(BaseModel):
    events: list[EventResponse]
    count: int


class ParticipationResponse(BaseModel):
    id: str
    user_id: str
    event_id: str
    status: str
    joined_at: str
    completed_at: str | None = None
