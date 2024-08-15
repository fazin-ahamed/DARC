from fastapi import FastAPI
from .database import Base, engine
from .routes import auth

app = FastAPI()

# Create the database tables
Base.metadata.create_all(bind=engine)

# Include routes
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the SaaS application"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
