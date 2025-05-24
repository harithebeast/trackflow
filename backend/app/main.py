from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn

from .database import get_db
from . import models, schemas
from .api import leads_router, orders_router, dashboard_router
from .config import settings

app = FastAPI(title="TrackFlow CRM API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(leads_router)
app.include_router(orders_router)
app.include_router(dashboard_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to TrackFlow CRM API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
