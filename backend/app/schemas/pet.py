from pydantic import BaseModel


class PetResponse(BaseModel):
    id: str
    name: str
    mood: str
    level: int
    xp: int
    xp_to_next_level: int
    evolution_stage: int
    streak_days: int
    last_fed_at: str | None = None

    model_config = {"from_attributes": True}


class PetUpdateRequest(BaseModel):
    name: str
