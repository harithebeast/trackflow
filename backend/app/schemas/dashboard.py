from pydantic import BaseModel
from typing import List
from .lead import Lead

class DashboardStats(BaseModel):
    total_leads: int
    open_leads: int
    total_orders: int
    pending_orders: int
    leads_due_this_week: List[Lead] = []
