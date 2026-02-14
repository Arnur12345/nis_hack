from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.pet import Pet
from app.schemas.pet import PetUpdateRequest
from app.services.pet_service import recalculate_mood, pet_to_dict

router = APIRouter(prefix="/api/v1/pet", tags=["pet"])


@router.get("")
def get_pet(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pet = db.query(Pet).filter(Pet.user_id == user.id).first()
    pet = recalculate_mood(db, pet)
    return {"pet": pet_to_dict(pet)}


@router.put("")
def update_pet(req: PetUpdateRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pet = db.query(Pet).filter(Pet.user_id == user.id).first()
    pet.name = req.name
    db.commit()
    db.refresh(pet)
    return {"pet": pet_to_dict(pet)}
