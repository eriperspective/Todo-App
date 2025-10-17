from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
import sys
import os
import bcrypt
from datetime import datetime
from bson import ObjectId
from jose import jwt

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import get_user_collection

# Request models
class SignupRequest(BaseModel):
    username: str
    email: str
    password: str
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        """Validate password meets requirements"""
        if not v:
            raise ValueError("Password cannot be empty")
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "john_doe",
                "email": "john@example.com",
                "password": "secure_password_123"
            }
        }

class LoginRequest(BaseModel):
    email: str
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@example.com",
                "password": "secure_password_123"
            }
        }

router = APIRouter()
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")

# Logout route
@router.post("/logout")
def logout():
    return {"message": "Logged out — please delete your token on the frontend"}

# CORS preflight handlers
@router.options("/signup")
def signup_options():
    return {}

@router.options("/login")
def login_options():
    return {}

# Signup route
@router.post("/signup")
def signup(user: SignupRequest, db=Depends(get_user_collection)):
    try:
        print(f"[SIGNUP DEBUG] Received request: username={user.username}, email={user.email}")
        print(f"[SIGNUP DEBUG] Password length: {len(user.password)} chars, {len(user.password.encode('utf-8'))} bytes")
        
        # Validate email format
        if not user.email or '@' not in user.email or '.' not in user.email.split('@')[-1]:
            print(f"[SIGNUP DEBUG] Invalid email format: {user.email}")
            raise HTTPException(status_code=400, detail="Invalid email format")
        
        # Validate password
        if not user.password or len(user.password) < 6:
            print(f"[SIGNUP DEBUG] Password too short")
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        
        # Truncate password to 72 bytes (bcrypt limitation)
        password_bytes = user.password.encode('utf-8')[:72]
        
        # Validate username
        if not user.username or len(user.username) < 3:
            print(f"[SIGNUP DEBUG] Username too short")
            raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
        
        if db.find_one({"email": user.email}):
            print(f"[SIGNUP DEBUG] Email already registered: {user.email}")
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password using bcrypt directly
        hashed_pw = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
        
        user_data = {
            "username": user.username,
            "email": user.email,
            "password": hashed_pw,
            "created_at": datetime.utcnow()
        }
        result = db.insert_one(user_data)
        print(f"[SIGNUP DEBUG] User created successfully: {result.inserted_id}")
        return {"user_id": str(result.inserted_id), "message": "User created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"[SIGNUP ERROR] Exception occurred: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")

# Login route
@router.post("/login")
def login(user: LoginRequest, db=Depends(get_user_collection)):
    try:
        print(f"[LOGIN DEBUG] Received request for email: {user.email}")
        
        # Validate email format
        if not user.email or '@' not in user.email:
            print(f"[LOGIN DEBUG] Invalid email format: {user.email}")
            raise HTTPException(status_code=400, detail="Invalid email format")
        
        # Validate password
        if not user.password:
            print(f"[LOGIN DEBUG] Password not provided")
            raise HTTPException(status_code=400, detail="Password required")
        
        # Truncate password to 72 bytes (bcrypt limitation)
        password_bytes = user.password.encode('utf-8')[:72]
        
        db_user = db.find_one({"email": user.email})
        
        # Verify password using bcrypt
        if not db_user or not bcrypt.checkpw(password_bytes, db_user["password"]):
            print(f"[LOGIN DEBUG] Invalid credentials for email: {user.email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create token with proper structure
        token_data = {
            "user_id": str(db_user["_id"]), 
            "email": user.email,
            "sub": user.email
        }
        token = jwt.encode(token_data, SECRET_KEY, algorithm="HS256")
        print(f"[LOGIN DEBUG] Login successful for: {user.email}")
        return {"access_token": token, "user_id": str(db_user["_id"]), "message": "Login successful"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"[LOGIN ERROR] Exception occurred: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")
