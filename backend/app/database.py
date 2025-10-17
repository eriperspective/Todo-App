from pymongo import MongoClient
from bson import ObjectId
import os
import bcrypt
from typing import Dict, List, Any
import json
from dotenv import load_dotenv

# Load environment variables

load_dotenv()
# Get MongoDB URI from environment or use default
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# In-memory storage as fallback
in_memory_storage = {
    "users": [],
    "tasks": [],
    "labels": []
}

# Global variables for lazy initialization
client = None
db = None
users_collection = None
tasks_collection = None
labels_collection = None
USE_MONGODB = None

def _initialize_database():
    """Initialize database connection lazily"""
    global client, db, users_collection, tasks_collection, labels_collection, USE_MONGODB
    
    if USE_MONGODB is not None:
        return  # Already initialized
    
    # Try to connect to MongoDB with shorter timeout
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=1000)  # Reduced to 1 second
        # Test connection
        client.server_info()
        db = client["todo_app"]
        users_collection = db["users"]
        tasks_collection = db["tasks"]
        labels_collection = db["labels"]
        USE_MONGODB = True
        print("Connected to MongoDB successfully")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        print("Using in-memory storage as fallback")
        USE_MONGODB = False
        
        # Create mock collections that behave like MongoDB collections
        class MockCollection:
            def __init__(self, collection_name: str):
                self.collection_name = collection_name
                self.data = in_memory_storage[collection_name]
                self._counter = 0
            
            def insert_one(self, document: Dict[str, Any]) -> Any:
                self._counter += 1
                doc_id = f"mock_id_{self._counter}"
                document["_id"] = doc_id
                self.data.append(document)
                return type('Result', (), {'inserted_id': doc_id})()
            
            def find_one(self, query: Dict[str, Any]) -> Any:
                for doc in self.data:
                    if all(doc.get(k) == v for k, v in query.items()):
                        return doc
                return None
            
            def find(self, query: Dict[str, Any] = None) -> List[Dict[str, Any]]:
                if query is None:
                    return self.data.copy()
                return [doc for doc in self.data if all(doc.get(k) == v for k, v in query.items())]
            
            def update_one(self, query: Dict[str, Any], update: Dict[str, Any]) -> Any:
                for i, doc in enumerate(self.data):
                    if all(doc.get(k) == v for k, v in query.items()):
                        if "$set" in update:
                            self.data[i].update(update["$set"])
                        return type('Result', (), {'modified_count': 1})()
                return type('Result', (), {'modified_count': 0})()
            
            def delete_one(self, query: Dict[str, Any]) -> Any:
                for i, doc in enumerate(self.data):
                    if all(doc.get(k) == v for k, v in query.items()):
                        del self.data[i]
                        return type('Result', (), {'deleted_count': 1})()
                return type('Result', (), {'deleted_count': 0})()
        
        users_collection = MockCollection("users")
        tasks_collection = MockCollection("tasks")
        labels_collection = MockCollection("labels")

# User functions
def create_user(username: str, email: str, password: str):
    _initialize_database()
    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    user_data = {
        "username": username,
        "email": email,
        "password": hashed_pw,
    }
    result = users_collection.insert_one(user_data)
    return str(result.inserted_id)

def find_user_by_email(email: str):
    _initialize_database()
    return users_collection.find_one({"email": email})

def verify_password(plain_password: str, hashed_password: bytes):
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password)

# 🏷️ Label functions
def create_label(label_data: dict, user_id: str):
    _initialize_database()
    label_data["user_id"] = user_id
    result = labels_collection.insert_one(label_data)
    return str(result.inserted_id)

def get_labels(user_id: str):
    _initialize_database()
    labels = labels_collection.find({"user_id": user_id})
    return [{**label, "_id": str(label["_id"])} for label in labels]

def assign_labels_to_task(task_id: str, labels: list):
    _initialize_database()
    # Handle both MongoDB ObjectId and mock string IDs
    if task_id.startswith("mock_id_"):
        tasks_collection.update_one({"_id": task_id}, {"$set": {"labels": labels}})
    else:
        try:
            tasks_collection.update_one({"_id": ObjectId(task_id)}, {"$set": {"labels": labels}})
        except:
            tasks_collection.update_one({"_id": task_id}, {"$set": {"labels": labels}})
    return True

# 📦 Collection accessors
def get_task_collection():
    _initialize_database()
    return tasks_collection

def get_label_collection():
    _initialize_database()
    return labels_collection

def get_user_collection():
    _initialize_database()
    return users_collection

