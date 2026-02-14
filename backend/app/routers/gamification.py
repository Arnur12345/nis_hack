from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.pet import Pet
from app.models.participation import EventParticipation
from app.models.event import Event
from app.services.achievement_service import get_user_achievements

router = APIRouter(prefix="/api/v1", tags=["gamification"])


@router.get("/leaderboard")
def leaderboard(db: Session = Depends(get_db)):
    pets = db.query(Pet).join(User, User.id == Pet.user_id).order_by(Pet.level.desc(), Pet.xp.desc()).limit(50).all()
    result = []
    for i, pet in enumerate(pets):
        result.append({
            "rank": i + 1,
            "username": pet.user.username,
            "level": pet.level,
            "xp": pet.xp,
            "pet_name": pet.name,
            "pet_evolution_stage": pet.evolution_stage,
        })
    return {"leaderboard": result}


@router.get("/achievements")
def achievements(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    earned, available = get_user_achievements(db, user.id)
    return {
        "earned": [{"id": a.id, "key": a.key, "title": a.title, "description": a.description, "icon": a.icon, "xp_bonus": a.xp_bonus} for a in earned],
        "available": [{"id": a.id, "key": a.key, "title": a.title, "description": a.description, "icon": a.icon, "xp_bonus": a.xp_bonus} for a in available],
    }


@router.get("/profile/stats")
def stats(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pet = db.query(Pet).filter(Pet.user_id == user.id).first()

    events_completed = db.query(func.count(EventParticipation.id)).filter(
        EventParticipation.user_id == user.id,
        EventParticipation.status == "completed",
    ).scalar()

    category_rows = (
        db.query(Event.category, func.count(EventParticipation.id))
        .join(EventParticipation, EventParticipation.event_id == Event.id)
        .filter(EventParticipation.user_id == user.id, EventParticipation.status == "completed")
        .group_by(Event.category)
        .all()
    )
    category_counts = {cat: cnt for cat, cnt in category_rows}

    total_xp = (pet.level - 1) * pet.level * 50 + pet.xp if pet else 0

    return {
        "events_completed": events_completed,
        "total_xp": total_xp,
        "streak_days": pet.streak_days if pet else 0,
        "level": pet.level if pet else 1,
        "category_counts": category_counts,
    }


DAY_NAMES_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]


@router.get("/profile/activity")
def activity(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Weekly activity: events completed per day for last 7 days + category breakdown."""
    today = datetime.utcnow().date()
    week_start = today - timedelta(days=6)

    # Get daily completions for last 7 days
    daily_rows = (
        db.query(
            cast(EventParticipation.completed_at, Date).label("day"),
            func.count(EventParticipation.id).label("cnt"),
            func.coalesce(func.sum(Event.xp_reward), 0).label("xp"),
        )
        .join(Event, Event.id == EventParticipation.event_id)
        .filter(
            EventParticipation.user_id == user.id,
            EventParticipation.status == "completed",
            EventParticipation.completed_at != None,
            cast(EventParticipation.completed_at, Date) >= week_start,
        )
        .group_by(cast(EventParticipation.completed_at, Date))
        .all()
    )

    daily_map = {row.day: {"count": row.cnt, "xp": int(row.xp)} for row in daily_rows}

    weekly_activity = []
    total_events = 0
    total_xp = 0
    for i in range(7):
        d = week_start + timedelta(days=i)
        info = daily_map.get(d, {"count": 0, "xp": 0})
        weekly_activity.append({
            "day": DAY_NAMES_RU[d.weekday()],
            "date": d.isoformat(),
            "count": info["count"],
            "xp": info["xp"],
        })
        total_events += info["count"]
        total_xp += info["xp"]

    # Category breakdown for this week
    cat_rows = (
        db.query(Event.category, func.count(EventParticipation.id))
        .join(EventParticipation, EventParticipation.event_id == Event.id)
        .filter(
            EventParticipation.user_id == user.id,
            EventParticipation.status == "completed",
            EventParticipation.completed_at != None,
            cast(EventParticipation.completed_at, Date) >= week_start,
        )
        .group_by(Event.category)
        .all()
    )
    category_breakdown = {cat: cnt for cat, cnt in cat_rows}

    return {
        "weekly_activity": weekly_activity,
        "this_week_events": total_events,
        "this_week_xp": total_xp,
        "category_breakdown": category_breakdown,
    }
