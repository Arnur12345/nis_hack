from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, UserResponse
from app.schemas.pet import PetResponse
from app.services.auth_service import register_user, login_user
from app.services.pet_service import pet_to_dict, recalculate_mood
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.pet import Pet

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    from app.models.user import User as UserModel
    existing = db.query(UserModel).filter(
        (UserModel.email == req.email) | (UserModel.username == req.username)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email or username already taken")

    user, pet, token = register_user(db, req.email, req.password, req.username)
    return {
        "user": UserResponse.model_validate(user).model_dump(),
        "pet": pet_to_dict(pet),
        "access_token": token,
    }


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user, pet, token = login_user(db, req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "user": UserResponse.model_validate(user).model_dump(),
        "pet": pet_to_dict(pet),
        "access_token": token,
    }


@router.get("/me")
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pet = db.query(Pet).filter(Pet.user_id == user.id).first()
    if pet:
        pet = recalculate_mood(db, pet)
    return {
        "user": UserResponse.model_validate(user).model_dump(),
        "pet": pet_to_dict(pet) if pet else None,
    }
