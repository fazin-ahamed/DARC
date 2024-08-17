from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth
from .database import engine
from .models import Base

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
app.include_router(auth.router, prefix="/auth")

# Create all database tables
Base.metadata.create_all(bind=engine)
