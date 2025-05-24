from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/trackflow")
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    algorithm: str = "HS256"
    cors_origins: list = [
        "http://localhost:3000",
        "https://trackflow-jzex.onrender.com"  # Your actual frontend URL
    ]
    
    class Config:
        env_file = ".env"

settings = Settings()
