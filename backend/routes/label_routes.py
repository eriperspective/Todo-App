from fastapi import APIRouter, Depends, HTTPException
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pydantic import BaseModel
from typing import List
from models.label_model import LabelCreate
from app.database import get_label_collection, get_task_collection, create_label, get_labels, assign_labels_to_task
from app.auth import get_current_user
from bson import ObjectId

router = APIRouter()

# Model for assigning labels to tasks
class LabelAssignment(BaseModel):
    labels: List[str]

@router.post("/labels")
def create(label: LabelCreate, user=Depends(get_current_user), db=Depends(get_label_collection)):
    try:
        label_id = create_label(label.dict(), user["_id"])
        return {"label_id": label_id, "message": "Label created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create label: {str(e)}")

@router.get("/labels")
def read(user=Depends(get_current_user), db=Depends(get_label_collection)):
    try:
        return get_labels(user["_id"])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch labels: {str(e)}")

@router.patch("/tasks/{task_id}/labels")
def assign(task_id: str, payload: LabelAssignment, user=Depends(get_current_user), db=Depends(get_task_collection)):
    try:
        assign_labels_to_task(task_id, payload.labels)
        return {"message": "Labels assigned successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to assign labels: {str(e)}")
