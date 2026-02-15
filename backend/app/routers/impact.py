from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.event import Event
from app.models.participation import EventParticipation
from app.models.pet import Pet

router = APIRouter(prefix="/api/v1/impact", tags=["impact"])


@router.get("")
def get_impact(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Total unique volunteers (users who completed at least 1 event)
    total_volunteers = db.query(func.count(func.distinct(EventParticipation.user_id))).filter(
        EventParticipation.status == "completed"
    ).scalar() or 0

    # Total events completed
    total_events_completed = db.query(func.count(EventParticipation.id)).filter(
        EventParticipation.status == "completed"
    ).scalar() or 0

    # Total XP earned across all pets
    total_xp_earned = db.query(func.sum(Pet.xp + (Pet.level - 1) * 100)).scalar() or 0

    # Category breakdown
    category_rows = (
        db.query(Event.category, func.count(EventParticipation.id))
        .join(EventParticipation, Event.id == EventParticipation.event_id)
        .filter(EventParticipation.status == "completed")
        .group_by(Event.category)
        .all()
    )
    category_breakdown = {cat: count for cat, count in category_rows}

    # Recent completions (last 10)
    recent = (
        db.query(User.username, Event.title, Event.category, EventParticipation.completed_at)
        .join(EventParticipation, User.id == EventParticipation.user_id)
        .join(Event, Event.id == EventParticipation.event_id)
        .filter(EventParticipation.status == "completed")
        .order_by(EventParticipation.completed_at.desc())
        .limit(10)
        .all()
    )
    recent_completions = [
        {
            "username": username,
            "event_title": title,
            "category": category,
            "completed_at": completed_at.isoformat() if completed_at else None,
        }
        for username, title, category, completed_at in recent
    ]

    return {
        "total_volunteers": total_volunteers,
        "total_events_completed": total_events_completed,
        "total_xp_earned": total_xp_earned,
        "category_breakdown": category_breakdown,
        "recent_completions": recent_completions,
    }
