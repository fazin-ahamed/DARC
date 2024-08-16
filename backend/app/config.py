from pydantic import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql://postgres.ccpighleiemxslknuvyh:fazin1980dxb@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
    secret_key: str = "your_secret_key_here"
    jwt_secret_key: str = "your_jwt_secret_key_here"
    websocket_port: int = 8001

    class Config:
        env_file = ".env"
