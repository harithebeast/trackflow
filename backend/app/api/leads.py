from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/leads", tags=["leads"])

@router.post("/", response_model=schemas.Lead)
def create_lead(lead: schemas.LeadCreate, db: Session = Depends(get_db)):
    db_lead = models.Lead(**lead.dict())
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.get("/", response_model=List[schemas.Lead])
def read_leads(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    leads = db.query(models.Lead).offset(skip).limit(limit).all()
    return leads

@router.get("/{lead_id}", response_model=schemas.Lead)
def read_lead(lead_id: str, db: Session = Depends(get_db)):
    try:
        lead_uuid = uuid.UUID(lead_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
    
    lead = db.query(models.Lead).filter(models.Lead.id == lead_uuid).first()
    if lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@router.put("/{lead_id}", response_model=schemas.Lead)
def update_lead(lead_id: str, lead: schemas.LeadUpdate, db: Session = Depends(get_db)):
    try:
        lead_uuid = uuid.UUID(lead_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
    
    db_lead = db.query(models.Lead).filter(models.Lead.id == lead_uuid).first()
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    for key, value in lead.dict(exclude_unset=True).items():
        setattr(db_lead, key, value)
    
    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.delete("/{lead_id}")
def delete_lead(lead_id: str, db: Session = Depends(get_db)):
    try:
        lead_uuid = uuid.UUID(lead_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
    
    db_lead = db.query(models.Lead).filter(models.Lead.id == lead_uuid).first()
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    db.delete(db_lead)
    db.commit()
    return {"message": "Lead deleted successfully"}
