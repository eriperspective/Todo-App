from fastapi import APIRouter, HTTPException
from app.models.user import User
from app.database import users_collection
from app.auth import create_access_token
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/signup")
def signup(user: User):
    try:
        # Check if user already exists
        existing_user = users_collection.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")

        # Truncate password to 72 bytes before hashing
        safe_password = user.password[:72]
        hashed_password = pwd_context.hash(safe_password)

        # Convert to dict and replace password
        user_dict = user.model_dump()
        user_dict["password"] = hashed_password

        # Insert into MongoDB
        result = users_collection.insert_one(user_dict)
        if result.inserted_id:
            return {
                "message": f"User {user.username} saved to MongoDB!",
                "user_id": str(result.inserted_id)
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to save user to database")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/login")
def login_user(user: User):
    existing_user = users_collection.find_one({"email": user.email})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Truncate password before verifying
    safe_password = user.password[:72]
    if not pwd_context.verify(safe_password, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    token = create_access_token({"email": existing_user["email"]})
    return {"access_token": token, "token_type": "bearer"}

