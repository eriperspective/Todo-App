# Environment Setup Guide

## Backend Setup

### MongoDB Atlas Configuration

1. Create a MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user with appropriate permissions
3. Whitelist your IP address in Network Access
4. Copy your connection string

### Environment Variables

Create a .env file in the backend/ directory with the following variables:

\\\
MONGODB_URI=your_mongodb_connection_string_here
SECRET_KEY=your_jwt_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=false
\\\

**Note:** Never commit the .env file to version control. Use .env.example for reference only.

### Running the Backend

\\\bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
\\\

## Important Security Notes

- Never hardcode credentials in your code
- Always use environment variables for sensitive information
- Rotate your database credentials regularly
- Keep your MongoDB URI and JWT secret secure
