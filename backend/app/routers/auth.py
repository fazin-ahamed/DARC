import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, security
from ..database import get_db

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        if db.query(models.User).filter(models.User.username == user.username).first():
            raise HTTPException(status_code=400, detail="Username already registered")
        hashed_password = security.get_password_hash(user.password)
        db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        logger.error(f"Registration failed: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

@router.post("/login")
def login(user: schemas.UserResponse, db: Session = Depends(get_db)):
    try:
        db_user = db.query(models.User).filter(models.User.username == user.username).first()
        if not db_user or not security.verify_password(user.password, db_user.hashed_password):
            raise HTTPException(status_code=400, detail="Invalid credentials")

        token = security.create_access_token(data={"sub": db_user.username})
        return {"status": "Login Successful", "access_token": token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Login failed: {e}")
        raise HTTPException(status_code=500, detail="Login failed")
