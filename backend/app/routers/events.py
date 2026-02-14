from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.pet import Pet
from app.services.event_service import get_events, get_event_detail, join_event, complete_event
from app.services.pet_service import add_xp, update_streak, pet_to_dict
from app.services.achievement_service import check_and_award_achievements

router = APIRouter(prefix="/api/v1/events", tags=["events"])


@router.get("")
def list_events(
    category: str | None = Query(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    events = get_events(db, category)
    return {"events": events, "count": len(events)}


@router.get("/{event_id}")
def event_detail(event_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    detail = get_event_detail(db, event_id, user.id)
    if not detail:
        raise HTTPException(status_code=404, detail="Event not found")
    return detail


@router.post("/{event_id}/join")
def join(event_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    participation = join_event(db, event_id, user.id)
    if not participation:
        raise HTTPException(status_code=404, detail="Event not found")
    return {
        "participation": {
            "id": participation.id,
            "user_id": participation.user_id,
            "event_id": participation.event_id,
            "status": participation.status,
            "joined_at": participation.joined_at.isoformat(),
        }
    }


@router.post("/{event_id}/complete")
def complete(event_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    participation, event = complete_event(db, event_id, user.id)
    if not participation:
        raise HTTPException(status_code=400, detail="Not joined or already completed")

    pet = db.query(Pet).filter(Pet.user_id == user.id).first()

    # Update streak and calculate bonus
    streak_bonus = update_streak(db, pet)
    total_xp = event.xp_reward + streak_bonus

    # Add XP to pet
    pet = add_xp(db, pet, total_xp)

    # Check achievements
    new_achievements = check_and_award_achievements(db, user.id, pet)

    # Add achievement XP bonuses
    achievement_xp = sum(a.xp_bonus for a in new_achievements)
    if achievement_xp > 0:
        pet = add_xp(db, pet, achievement_xp)

    return {
        "participation": {
            "id": participation.id,
            "user_id": participation.user_id,
            "event_id": participation.event_id,
            "status": participation.status,
            "joined_at": participation.joined_at.isoformat(),
            "completed_at": participation.completed_at.isoformat() if participation.completed_at else None,
        },
        "xp_earned": total_xp + achievement_xp,
        "streak_bonus": streak_bonus,
        "pet": pet_to_dict(pet),
        "new_achievements": [
            {"id": a.id, "key": a.key, "title": a.title, "description": a.description, "icon": a.icon, "xp_bonus": a.xp_bonus}
            for a in new_achievements
        ],
    }
