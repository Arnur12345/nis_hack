from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.achievement import Achievement, UserAchievement
from app.models.participation import EventParticipation
from app.models.event import Event
from app.models.pet import Pet


def check_and_award_achievements(db: Session, user_id: str, pet: Pet) -> list[Achievement]:
    all_achievements = db.query(Achievement).all()
    earned_ids = set(
        row[0] for row in db.query(UserAchievement.achievement_id)
        .filter(UserAchievement.user_id == user_id).all()
    )

    completed_count = db.query(func.count(EventParticipation.id)).filter(
        EventParticipation.user_id == user_id,
        EventParticipation.status == "completed",
    ).scalar()

    category_counts = {}
    rows = (
        db.query(Event.category, func.count(EventParticipation.id))
        .join(EventParticipation, EventParticipation.event_id == Event.id)
        .filter(EventParticipation.user_id == user_id, EventParticipation.status == "completed")
        .group_by(Event.category)
        .all()
    )
    for cat, cnt in rows:
        category_counts[cat] = cnt

    new_achievements = []
    for achievement in all_achievements:
        if achievement.id in earned_ids:
            continue

        earned = False
        if achievement.condition_type == "events_completed":
            earned = completed_count >= achievement.condition_value
        elif achievement.condition_type == "streak":
            earned = pet.streak_days >= achievement.condition_value
        elif achievement.condition_type == "level":
            earned = pet.level >= achievement.condition_value
        elif achievement.condition_type.startswith("category_"):
            cat = achievement.condition_type.replace("category_", "")
            earned = category_counts.get(cat, 0) >= achievement.condition_value

        if earned:
            ua = UserAchievement(user_id=user_id, achievement_id=achievement.id)
            db.add(ua)
            new_achievements.append(achievement)

    if new_achievements:
        db.commit()

    return new_achievements


def get_user_achievements(db: Session, user_id: str) -> tuple[list[Achievement], list[Achievement]]:
    earned_ids = set(
        row[0] for row in db.query(UserAchievement.achievement_id)
        .filter(UserAchievement.user_id == user_id).all()
    )
    all_achievements = db.query(Achievement).all()

    earned = [a for a in all_achievements if a.id in earned_ids]
    available = [a for a in all_achievements if a.id not in earned_ids]
    return earned, available
