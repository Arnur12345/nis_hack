from pydantic import BaseModel


class AchievementResponse(BaseModel):
    id: str
    key: str
    title: str
    description: str
    icon: str
    xp_bonus: int

    model_config = {"from_attributes": True}


class AchievementsListResponse(BaseModel):
    earned: list[AchievementResponse]
    available: list[AchievementResponse]


class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    level: int
    xp: int
    pet_name: str
    pet_evolution_stage: int


class LeaderboardResponse(BaseModel):
    leaderboard: list[LeaderboardEntry]


class CompleteEventResponse(BaseModel):
    participation: dict
    xp_earned: int
    streak_bonus: int
    pet: dict
    new_achievements: list[AchievementResponse]


class StatsResponse(BaseModel):
    events_completed: int
    total_xp: int
    streak_days: int
    level: int
    category_counts: dict[str, int]


class DayActivity(BaseModel):
    day: str
    date: str
    count: int
    xp: int


class ActivityResponse(BaseModel):
    weekly_activity: list[DayActivity]
    this_week_events: int
    this_week_xp: int
    category_breakdown: dict[str, int]
