from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import uuid
from ..models import Order, OrderStatus, Lead, LeadStage
from ..schemas import OrderCreate, OrderUpdate

def create_order(db: Session, order: OrderCreate) -> Optional[Order]:
    # Check if lead exists and is in Won stage
    lead = db.query(Lead).filter(Lead.id == order.lead_id).first()
    if not lead or lead.stage != LeadStage.WON:
        return None
    
    db_order = Order(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: Optional[OrderStatus] = None
) -> List[Order]:
    query = db.query(Order)
    if status:
        query = query.filter(Order.status == status)
    return query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()

def get_order(db: Session, order_id: uuid.UUID) -> Optional[Order]:
    return db.query(Order).filter(Order.id == order_id).first()

def update_order(db: Session, order_id: uuid.UUID, order_update: OrderUpdate) -> Optional[Order]:
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order:
        update_data = order_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_order, key, value)
        db.commit()
        db.refresh(db_order)
    return db_order

def get_orders_by_status(db: Session):
    results = db.query(Order.status, func.count(Order.id)).group_by(Order.status).all()
    return {status.value: count for status, count in results}
