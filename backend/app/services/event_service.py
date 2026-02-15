from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.event import Event
from app.models.participation import EventParticipation
from app.models.user import User


def _event_to_dict(event: Event, count: int, creator_username: str | None = None) -> dict:
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
        "creator_id": event.creator_id,
        "creator_username": creator_username,
        "status": event.status,
        "qr_code": event.qr_code,
    }


def get_events(db: Session, category: str | None = None) -> list[dict]:
    participation_count = (
        db.query(
            EventParticipation.event_id,
            func.count(EventParticipation.id).label("cnt"),
        )
        .filter(EventParticipation.status.in_(["joined", "completed"]))
        .group_by(EventParticipation.event_id)
        .subquery()
    )

    query = (
        db.query(Event, func.coalesce(participation_count.c.cnt, 0).label("participants_count"), User.username)
        .outerjoin(participation_count, Event.id == participation_count.c.event_id)
        .outerjoin(User, Event.creator_id == User.id)
    )
    if category:
        query = query.filter(Event.category == category)
    query = query.filter(Event.status == "approved")
    query = query.order_by(Event.start_time)
    rows = query.all()

    return [_event_to_dict(event, count, username) for event, count, username in rows]


def get_popular_event(db: Session) -> dict | None:
    """Return the event with the most participants."""
    participation_count = (
        db.query(
            EventParticipation.event_id,
            func.count(EventParticipation.id).label("cnt"),
        )
        .filter(EventParticipation.status.in_(["joined", "completed"]))
        .group_by(EventParticipation.event_id)
        .subquery()
    )

    row = (
        db.query(Event, func.coalesce(participation_count.c.cnt, 0).label("participants_count"), User.username)
        .outerjoin(participation_count, Event.id == participation_count.c.event_id)
        .outerjoin(User, Event.creator_id == User.id)
        .filter(Event.status == "approved")
        .order_by(func.coalesce(participation_count.c.cnt, 0).desc(), Event.start_time)
        .first()
    )
    if not row:
        return None

    event, count, username = row
    return _event_to_dict(event, count, username)


def get_event_detail(db: Session, event_id: str, user_id: str) -> dict | None:
    row = (
        db.query(Event, User.username)
        .outerjoin(User, Event.creator_id == User.id)
        .filter(Event.id == event_id)
        .first()
    )
    if not row:
        return None

    event, creator_username = row

    count = db.query(func.count(EventParticipation.id)).filter(
        EventParticipation.event_id == event.id,
        EventParticipation.status.in_(["joined", "completed"]),
    ).scalar()

    participation = db.query(EventParticipation).filter(
        EventParticipation.event_id == event_id,
        EventParticipation.user_id == user_id,
    ).first()

    result = _event_to_dict(event, count, creator_username)
    result["is_joined"] = participation is not None and participation.status in ("joined", "completed")
    result["is_completed"] = participation is not None and participation.status == "completed"
    return result


def create_event(db: Session, user_id: str, data: dict) -> Event:
    event = Event(
        title=data["title"],
        description=data["description"],
        category=data["category"],
        latitude=data["latitude"],
        longitude=data["longitude"],
        address=data["address"],
        start_time=data["start_time"],
        end_time=data.get("end_time"),
        xp_reward=data.get("xp_reward", 50),
        max_participants=data.get("max_participants"),
        creator_id=user_id,
        status="approved",
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


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


def verify_qr(db: Session, event_id: str, qr_code: str) -> Event | None:
    """Verify that the QR code matches the event."""
    event = db.query(Event).filter(Event.id == event_id, Event.qr_code == qr_code).first()
    return event
