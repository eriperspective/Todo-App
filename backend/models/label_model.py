from pydantic import BaseModel, Field

class LabelCreate(BaseModel):
    name: str = Field(..., min_length=1)
