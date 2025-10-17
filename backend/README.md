FastAPI Backend

This backend powers the todo app using [FastAPI](https://fastapi.tiangolo.com/). It includes a working `/signup` route and is ready for MongoDB integration.

Features

- FastAPI app with automatic Swagger docs
- `/signup` route for user registration
- Pydantic models for request validation
- Uvicorn server with hot reload

Setup Instructions

1. Clone the repo  
   ```bash
   git clone https://github.com/wealthy/todo-app-backend.git
   cd todo-app-backend/backend

2. Create a virtual environment
python -m venv venv
.\venv\Scripts\activate

3. Install dependencies
pip install -r requirements.txt

4. Run the server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

5. Access Swagger docs
Visit: http://127.0.0.1:8000/docs

JWT Authentication

This backend now supports secure user authentication using JSON Web Tokens (JWT).

Features
- User registration (`/signup`)
- User login (`/login`)
- Password hashing with `bcrypt`
- JWT token generation and expiration
- Pydantic v2 models with `model_dump()`
- Timezone-aware expiration timestamps

Example Login Response

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}

Use this token in protected routes with:
Authorization: Bearer <your_token>


📁 Folder Structure
backend/
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models/
│   └── routes/
├── venv/
├── .env
└── requirements.txt


