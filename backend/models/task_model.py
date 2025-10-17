from pydantic import BaseModel, Field, constr, validator
from typing import Optional, List
from datetime import date, datetime

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    priority: constr(pattern="^(High|Medium|Low)$") = Field(...)
    deadline: datetime
    start_time: Optional[str] = None  # Format: "HH:MM"
    end_time: Optional[str] = None    # Format: "HH:MM"
    labels: Optional[List[str]] = []
    completed: Optional[bool] = False

    @validator('deadline', pre=True)
    def convert_deadline_to_datetime(cls, v):
        """Convert date to datetime at midnight for MongoDB compatibility"""
        if isinstance(v, datetime):
            # Already a datetime, return as-is
            return v
        elif isinstance(v, date):
            # Convert date to datetime at midnight
            return datetime.combine(v, datetime.min.time())
        elif isinstance(v, str):
            # Parse the date string (format: YYYY-MM-DD or ISO format)
            try:
                # Try ISO format first (includes time)
                return datetime.fromisoformat(v)
            except ValueError:
                # Fall back to date-only format
                date_obj = datetime.fromisoformat(v).date()
                return datetime.combine(date_obj, datetime.min.time())
        else:
            # Try to handle other types by converting to datetime
            raise ValueError(f"Invalid deadline type: {type(v)}. Expected datetime or string in YYYY-MM-DD format.")

