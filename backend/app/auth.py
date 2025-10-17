from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.database import get_user_collection
from bson import ObjectId
import os

# Replace this with a secure, random string in production
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({
        "exp": expire,
        "sub": data["email"]  # or use "_id" if preferred
    })
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        user_email = payload.get("email")
        
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token: missing user_id")

        users_collection = get_user_collection()
        
        # Handle both MongoDB ObjectId and mock string IDs
        if user_id.startswith("mock_id_"):
            user = users_collection.find_one({"_id": user_id})
        else:
            try:
                user = users_collection.find_one({"_id": ObjectId(user_id)})
            except:
                user = users_collection.find_one({"_id": user_id})
                
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return user
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication error: {str(e)}")
