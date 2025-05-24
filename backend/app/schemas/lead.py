from pydantic import BaseModel, UUID4
from typing import Optional, List
from datetime import datetime
from .order import Order

class LeadBase(BaseModel):
    name: str
    email: str
    phone: str
    company: str
    stage: str
    source: str
    notes: Optional[str] = None
    follow_up_date: Optional[datetime] = None

class LeadCreate(LeadBase):
    pass

class LeadUpdate(BaseModel):
    stage: Optional[str] = None
    notes: Optional[str] = None
    follow_up_date: Optional[datetime] = None

class Lead(LeadBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime
    orders: List[Order] = []

    class Config:
        from_attributes = True
