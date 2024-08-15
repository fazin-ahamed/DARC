from pydantic import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql://username:password@localhost:5432/darc_db"
    secret_key: str = "your_secret_key_here"
    jwt_secret_key: str = "your_jwt_secret_key_here"
    websocket_port: int = 8001

    class Config:
        env_file = ".env"
