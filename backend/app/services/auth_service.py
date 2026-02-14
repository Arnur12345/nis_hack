from datetime import datetime, timedelta

from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from app.models.user import User
from app.models.pet import Pet

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": user_id, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def register_user(db: Session, email: str, password: str, username: str) -> tuple[User, Pet, str]:
    user = User(
        email=email,
        password_hash=hash_password(password),
        username=username,
    )
    db.add(user)
    db.flush()

    pet = Pet(user_id=user.id, name="Buddy")
    db.add(pet)
    db.commit()
    db.refresh(user)
    db.refresh(pet)

    token = create_access_token(user.id)
    return user, pet, token


def login_user(db: Session, email: str, password: str) -> tuple[User, Pet, str]:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        return None, None, None

    pet = db.query(Pet).filter(Pet.user_id == user.id).first()
    token = create_access_token(user.id)
    return user, pet, token
