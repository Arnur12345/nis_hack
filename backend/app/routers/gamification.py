from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

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
