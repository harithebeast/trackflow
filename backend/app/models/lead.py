from sqlalchemy import Column, String, DateTime, Enum, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from ..database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    company = Column(String, nullable=False)
    source = Column(String, nullable=False)
    product_interest = Column(String, nullable=True)
    stage = Column(
        Enum('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost', 
             name='lead_stage'),
        nullable=False,
        default='New'
    )
    follow_up_date = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with orders
    orders = relationship("Order", back_populates="lead", cascade="all, delete-orphan")
