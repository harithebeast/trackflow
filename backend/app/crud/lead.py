from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import date, datetime, timedelta
import uuid
from ..models import Lead, LeadStage
from ..schemas import LeadCreate, LeadUpdate

def create_lead(db: Session, lead: LeadCreate) -> Lead:
    db_lead = Lead(**lead.dict())
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

def get_leads(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    stage: Optional[LeadStage] = None
) -> List[Lead]:
    query = db.query(Lead)
    if stage:
        query = query.filter(Lead.stage == stage)
    return query.order_by(Lead.created_at.desc()).offset(skip).limit(limit).all()

def get_lead(db: Session, lead_id: uuid.UUID) -> Optional[Lead]:
    return db.query(Lead).filter(Lead.id == lead_id).first()

def update_lead(db: Session, lead_id: uuid.UUID, lead_update: LeadUpdate) -> Optional[Lead]:
    db_lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if db_lead:
        update_data = lead_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_lead, key, value)
        db.commit()
        db.refresh(db_lead)
    return db_lead

def delete_lead(db: Session, lead_id: uuid.UUID) -> bool:
    db_lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if db_lead:
        db.delete(db_lead)
        db.commit()
        return True
    return False

def get_leads_due_this_week(db: Session) -> List[Lead]:
    today = date.today()
    end_of_week = today + timedelta(days=7)
    return db.query(Lead).filter(
        and_(
            Lead.follow_up_date >= today,
            Lead.follow_up_date <= end_of_week,
            Lead.stage.notin_([LeadStage.WON, LeadStage.LOST])
        )
    ).all()

def get_dashboard_stats(db: Session):
    total_leads = db.query(func.count(Lead.id)).scalar()
    open_leads = db.query(func.count(Lead.id)).filter(
        Lead.stage.notin_([LeadStage.WON, LeadStage.LOST])
    ).scalar()
    won_leads = db.query(func.count(Lead.id)).filter(Lead.stage == LeadStage.WON).scalar()
    
    conversion_rate = (won_leads / total_leads * 100) if total_leads > 0 else 0
    
    return {
        "total_leads": total_leads,
        "open_leads": open_leads,
        "conversion_rate": round(conversion_rate, 2)
    }
