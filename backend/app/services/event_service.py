from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.event import Event
from app.models.participation import EventParticipation


def get_events(db: Session, category: str | None = None) -> list[dict]:
    query = db.query(Event)
    if category:
        query = query.filter(Event.category == category)
    query = query.order_by(Event.start_time)
    events = query.all()

    result = []
    for event in events:
        count = db.query(func.count(EventParticipation.id)).filter(
            EventParticipation.event_id == event.id,
            EventParticipation.status.in_(["joined", "completed"]),
        ).scalar()
        result.append({
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "category": event.category,
            "latitude": event.latitude,
            "longitude": event.longitude,
            "address": event.address,
            "start_time": event.start_time.isoformat(),
            "end_time": event.end_time.isoformat() if event.end_time else None,
            "xp_reward": event.xp_reward,
            "max_participants": event.max_participants,
            "image_url": event.image_url,
            "participants_count": count,
        })
    return result


def get_event_detail(db: Session, event_id: str, user_id: str) -> dict | None:
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        return None

    count = db.query(func.count(EventParticipation.id)).filter(
        EventParticipation.event_id == event.id,
        EventParticipation.status.in_(["joined", "completed"]),
    ).scalar()

    participation = db.query(EventParticipation).filter(
        EventParticipation.event_id == event_id,
        EventParticipation.user_id == user_id,
    ).first()

    return {
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "category": event.category,
        "latitude": event.latitude,
        "longitude": event.longitude,
        "address": event.address,
        "start_time": event.start_time.isoformat(),
        "end_time": event.end_time.isoformat() if event.end_time else None,
        "xp_reward": event.xp_reward,
        "max_participants": event.max_participants,
        "image_url": event.image_url,
        "participants_count": count,
        "is_joined": participation is not None and participation.status in ("joined", "completed"),
        "is_completed": participation is not None and participation.status == "completed",
    }


def join_event(db: Session, event_id: str, user_id: str) -> EventParticipation | None:
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        return None

    existing = db.query(EventParticipation).filter(
        EventParticipation.event_id == event_id,
        EventParticipation.user_id == user_id,
    ).first()
    if existing:
        return existing

    participation = EventParticipation(
        event_id=event_id,
        user_id=user_id,
        status="joined",
    )
    db.add(participation)
    db.commit()
    db.refresh(participation)
    return participation


def complete_event(db: Session, event_id: str, user_id: str) -> tuple[EventParticipation | None, Event | None]:
    participation = db.query(EventParticipation).filter(
        EventParticipation.event_id == event_id,
        EventParticipation.user_id == user_id,
        EventParticipation.status == "joined",
    ).first()
    if not participation:
        return None, None

    event = db.query(Event).filter(Event.id == event_id).first()
    participation.status = "completed"
    participation.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(participation)
    return participation, event
