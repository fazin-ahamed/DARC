from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, security
from ..database import get_db

router = APIRouter()

@router.post("/auth/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        # Hash the password and create a new user
        hashed_password = security.get_password_hash(user.password)
        db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
        
        # Add and commit the new user to the database
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        # Handle exceptions with appropriate status code
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/auth/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Query the database for the user
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Verify the provided password
    if not security.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Generate a token or session info (example token returned)
    token = security.create_access_token(data={"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}
