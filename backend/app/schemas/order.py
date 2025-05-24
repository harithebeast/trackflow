from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime

class OrderBase(BaseModel):
    lead_id: UUID4
    status: str
    dispatch_date: Optional[datetime] = None
    courier: Optional[str] = None
    tracking_number: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    dispatch_date: Optional[datetime] = None
    courier: Optional[str] = None
    tracking_number: Optional[str] = None

class Order(OrderBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
