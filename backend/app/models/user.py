from pydantic import BaseModel, EmailStr

# User model for auth routes
class User(BaseModel):
    username: str
    email: EmailStr
    password: str

# Signup schema
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# Login schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Optional: Response schema (used for returning user info)
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True
