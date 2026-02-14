from datetime import datetime

from sqlalchemy.orm import Session

from app.models.pet import Pet

EVOLUTION_LEVELS = {1: 1, 3: 2, 6: 3, 10: 4}


def calculate_mood(pet: Pet) -> str:
    if pet.last_fed_at is None:
        return "neutral"
    hours = (datetime.utcnow() - pet.last_fed_at).total_seconds() / 3600
    if hours < 12:
        return "happy"
    elif hours < 24:
        return "neutral"
    elif hours < 48:
        return "sad"
    return "sleeping"


def recalculate_mood(db: Session, pet: Pet) -> Pet:
    new_mood = calculate_mood(pet)
    if pet.mood != new_mood:
        pet.mood = new_mood
        db.commit()
        db.refresh(pet)
    return pet


def add_xp(db: Session, pet: Pet, xp_amount: int) -> Pet:
    pet.xp += xp_amount
    pet.last_fed_at = datetime.utcnow()

    # Level up loop
    while pet.xp >= pet.xp_to_next_level:
        pet.xp -= pet.xp_to_next_level
        pet.level += 1
        pet.xp_to_next_level = pet.level * 100

        # Check evolution
        if pet.level in EVOLUTION_LEVELS:
            pet.evolution_stage = EVOLUTION_LEVELS[pet.level]

    pet.mood = "happy"
    db.commit()
    db.refresh(pet)
    return pet


def update_streak(db: Session, pet: Pet) -> int:
    today = datetime.utcnow().strftime("%Y-%m-%d")
    yesterday = (datetime.utcnow().replace(hour=0, minute=0, second=0) - __import__("datetime").timedelta(days=1)).strftime("%Y-%m-%d")

    if pet.streak_last_date == today:
        # Already counted today
        return 0

    if pet.streak_last_date == yesterday:
        pet.streak_days += 1
    elif pet.streak_last_date is None or pet.streak_last_date != today:
        pet.streak_days = 1

    pet.streak_last_date = today
    streak_bonus = min(pet.streak_days * 5, 50)

    db.commit()
    db.refresh(pet)
    return streak_bonus


def pet_to_dict(pet: Pet) -> dict:
    return {
        "id": pet.id,
        "name": pet.name,
        "mood": pet.mood,
        "level": pet.level,
        "xp": pet.xp,
        "xp_to_next_level": pet.xp_to_next_level,
        "evolution_stage": pet.evolution_stage,
        "streak_days": pet.streak_days,
        "last_fed_at": pet.last_fed_at.isoformat() if pet.last_fed_at else None,
    }
