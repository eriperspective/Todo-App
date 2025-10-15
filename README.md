Full-Stack Todo App — FastAPI + MongoDB + Next.js
A modern, full-featured Todo application built with FastAPI (Python) for the backend, MongoDB Atlas for data storage, and Next.js (React + TypeScript) for the frontend. This app supports user authentication, task and label management, and a responsive dashboard UI — all organized with clean architecture and scalable practices.

Tech Stack
Layer	    Technology
Frontend	Next.js 14, React, TypeScript, Tailwind CSS
Backend	    FastAPI, Pydantic v2, Uvicorn
Database	MongoDB Atlas (NoSQL) via pymongo
Auth	    JWT-based authentication, bcrypt
Dev Tools	ESLint, Prettier, Pyright, dotenv
Deployment	Vercel (frontend), Render/Heroku (backend-ready)

Features
✅ User Signup & Login with JWT

✅ MongoDB Atlas integration for persistent storage

✅ CRUD operations for Todos and Labels

✅ Responsive dashboard UI with protected routes

✅ Password hashing and secure token handling

✅ Modular backend with routers, models, and schemas

✅ Clean folder structure and modern coding standards

Project Structure
todo-app/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app entry point
│   │   ├── database.py        # MongoDB connection logic
│   │   ├── models/            # Pydantic schemas
│   │   ├── routes/            # Auth and task routes
│   ├── .env                   # MongoDB URI and JWT secrets
│   ├── requirements.txt       # Python dependencies
│   ├── test_signup.py         # Signup test script
│   └── venv/                  # Virtual environment (excluded from Git)
├── frontend/
│   ├── components/            # Reusable UI components
│   ├── pages/                 # login.tsx, signup.tsx, dashboard.tsx
│   ├── public/                # Static assets
│   ├── styles/                # Tailwind CSS
│   ├── utils/                 # Helper functions
│   ├── package.json           # Frontend dependencies
│   ├── tsconfig.json          # TypeScript config
│   └── node_modules/          # Installed packages (excluded from Git)


Todo App Startup Scripts

Backend Setup and Start (FastAPI + MongoDB)

1. Navigate to backend directory:
```bash
cd backend
```

2. create and Activate virtual environment:
python -m venv venv
# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```
4. Create .env file
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/todo-app?retryWrites=true&w=majority
SECRET_KEY=your_jwt_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

5. Start and Run the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Access Swagger docs
Visit: http://127.0.0.1:8000/docs

Frontend Setup and Start

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the Next.js development server:
```bash
npm run dev
```

JWT Authentication
/signup → Registers user and stores in MongoDB

/login → Verifies credentials and returns JWT token

Passwords are hashed with bcrypt

Tokens expire with timezone-aware timestamps

Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

Database

The app uses MongoDB Atlas. The connection string is configured in `backend/app/database.py`.

1. Navigate to frontend
cd ../frontend

2. Install dependencies
npm install

3. Run the frontend
npm run dev
Visit: http://localhost:3000

Testing
Use Swagger UI or Postman to test /signup and /login

Use browser DevTools to inspect token storage and dashboard rendering

Run test_signup.py to verify backend signup flow

Features

- User authentication (signup/login)
- Task management (create, read, update, delete)
- Label management
- Task labeling
- Responsive design with Tailwind CSS

License
This project is licensed under the MIT License.