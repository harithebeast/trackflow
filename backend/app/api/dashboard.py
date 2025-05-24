from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Get total leads
    total_leads = db.query(func.count(models.Lead.id)).scalar()
    
    # Get open leads (leads not in Won or Lost stage)
    open_leads = db.query(func.count(models.Lead.id)).filter(
        ~models.Lead.stage.in_(['Won', 'Lost'])
    ).scalar()
    
    # Get total orders
    total_orders = db.query(func.count(models.Order.id)).scalar()
    
    # Get pending orders (orders not in Dispatched stage)
    pending_orders = db.query(func.count(models.Order.id)).filter(
        models.Order.status != 'Dispatched'
    ).scalar()
    
    # Get leads due for follow-up this week
    today = datetime.utcnow()
    week_end = today + timedelta(days=7)
    leads_due_this_week = db.query(models.Lead).filter(
        models.Lead.follow_up_date >= today,
        models.Lead.follow_up_date <= week_end
    ).all()
    
    return schemas.DashboardStats(
        total_leads=total_leads,
        open_leads=open_leads,
        total_orders=total_orders,
        pending_orders=pending_orders,
        leads_due_this_week=leads_due_this_week
    )
