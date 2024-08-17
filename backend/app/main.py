from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, dashboard
from . import models, schemas, crud
from .database import get_db, engine, Base
from .security import verify_password 

load_dotenv()  # Load environment variables

app = FastAPI()

# Set up CORS
origins = [
    "http://localhost:3000",  # Local development
    "https://your-frontend-domain.vercel.app",  # Vercel frontend domain
    "https://your-backend-domain.onrender.com"  # Render backend domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the auth router
app.include_router(auth.router)
app.include_router(dashboard.router)

# Create all database tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Welcome to the DARC API"}


@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"message": "Login successful"}
