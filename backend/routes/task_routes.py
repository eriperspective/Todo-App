from fastapi import APIRouter, Depends, HTTPException
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pydantic import BaseModel
from typing import Optional, List
from models.task_model import TaskCreate
from database.task_db import create_task, get_tasks, update_task, delete_task
from app.database import get_task_collection
from app.auth import get_current_user

router = APIRouter()

# Task Update model for PUT requests
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    deadline: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    labels: Optional[List[str]] = None
    completed: Optional[bool] = None
    assignee: Optional[str] = None

@router.post("/tasks")
def create(task: TaskCreate, user=Depends(get_current_user), db=Depends(get_task_collection)):
    try:
        task_id = create_task(db, task, user["_id"])
        return {"task_id": task_id, "message": "Task created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create task: {str(e)}")

@router.get("/tasks")
def read(user=Depends(get_current_user), db=Depends(get_task_collection)):
    return get_tasks(db, user["_id"])

@router.put("/tasks/{task_id}")
def update(task_id: str, updates: TaskUpdate, user=Depends(get_current_user), db=Depends(get_task_collection)):
    try:
        # Convert TaskUpdate to dict, removing None values
        update_dict = {k: v for k, v in updates.dict().items() if v is not None}
        if not update_dict:
            return {"message": "No updates provided"}
        update_task(db, task_id, update_dict)
        return {"message": "Task updated"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to update task: {str(e)}")

@router.delete("/tasks/{task_id}")
def delete(task_id: str, user=Depends(get_current_user), db=Depends(get_task_collection)):
    try:
        delete_task(db, task_id)
        return {"message": "Task deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to delete task: {str(e)}")

