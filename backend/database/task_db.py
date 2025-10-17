from bson import ObjectId
from pymongo.collection import Collection
from models.task_model import TaskCreate
from datetime import datetime

def create_task(db: Collection, task_data: TaskCreate, user_id: str):
    task_dict = task_data.dict()
    task_dict["user_id"] = user_id
    task_dict["created_at"] = datetime.utcnow()
    result = db.insert_one(task_dict)
    return str(result.inserted_id)

def get_tasks(db: Collection, user_id: str):
    tasks = db.find({"user_id": user_id})
    result = []
    for task in tasks:
        task["_id"] = str(task["_id"])
        # Serialize datetime objects to ISO format strings
        if "deadline" in task and isinstance(task["deadline"], datetime):
            task["deadline"] = task["deadline"].isoformat()
        if "created_at" in task and isinstance(task["created_at"], datetime):
            task["created_at"] = task["created_at"].isoformat()
        result.append(task)
    return result

def update_task(db: Collection, task_id: str, updates: dict):
    # Handle both MongoDB ObjectId and mock string IDs
    if task_id.startswith("mock_id_"):
        db.update_one({"_id": task_id}, {"$set": updates})
    else:
        try:
            db.update_one({"_id": ObjectId(task_id)}, {"$set": updates})
        except:
            db.update_one({"_id": task_id}, {"$set": updates})
    return True

def delete_task(db: Collection, task_id: str):
    # Handle both MongoDB ObjectId and mock string IDs
    if task_id.startswith("mock_id_"):
        db.delete_one({"_id": task_id})
    else:
        try:
            db.delete_one({"_id": ObjectId(task_id)})
        except:
            db.delete_one({"_id": task_id})
    return True
