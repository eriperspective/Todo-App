# Todo App

A modern full-stack task management application built with **FastAPI** (Python) and **Next.js** (React + TypeScript). Features task management, authentication, calendar view, labels, and affirmations.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Backend: FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)
![Frontend: Next.js](https://img.shields.io/badge/Frontend-Next.js-000000.svg)

## Features

- **Authentication**: JWT-based login/signup with bcrypt password hashing
- **Task Management**: Create, update, delete, filter, and search tasks by priority/labels
- **Calendar View**: Visual monthly calendar with task indicators
- **Labels & Organization**: Custom labels for task categorization
- **User Profile**: Customizable avatar, username, email, and bio
- **Affirmations**: 30+ curated spiritual affirmations with animations
- **Theme Support**: Light/Dark mode with persistent settings
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | FastAPI, Python | ≥0.115.0 |
| Frontend | Next.js, React, TypeScript | 15.5.5 |
| Database | MongoDB | ≥4.10.0 |
| Authentication | JWT, bcrypt | - |

## Project Structure

```
todo-app/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app
│   │   ├── database.py       # MongoDB connection
│   │   ├── auth.py           # JWT & authentication
│   │   ├── routes/           # API endpoints
│   │   └── models/           # Data models
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Environment template
├── frontend/
│   ├── pages/                # React pages
│   ├── components/           # Reusable components
│   ├── utils/api.ts          # API client
│   ├── package.json          # Node dependencies
│   └── .env.example          # Environment template
├── .gitignore                # Git ignore rules
├── LICENSE                   # MIT License
└── README.md                 # This file
```

## Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.8+
- **MongoDB** (local or MongoDB Atlas)

## Setup & Installation

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS/Linux

cp .env.example .env
# Edit .env with your MongoDB URI and SECRET_KEY

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local

npm run dev
```

Access at: `http://localhost:3000`

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017
SECRET_KEY=your-secure-random-key
ENV=development
PORT=8000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NODE_ENV=development
```

**Important**: Never commit `.env` files. Use `.env.example` as templates. Both are listed in `.gitignore`.

## Running the Application

### Quick Start (Windows)
```bash
./start-app.bat
```

### Manual Start
```bash
# Terminal 1: Backend
cd backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

## API Documentation

Once backend is running:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Main Endpoints
- `POST /signup` - Register user
- `POST /login` - Login user
- `GET/POST /api/tasks` - Task operations
- `PUT /api/tasks/{taskId}` - Update task
- `DELETE /api/tasks/{taskId}` - Delete task
- `GET/POST /api/labels` - Label operations

## Security

- Passwords hashed with **bcrypt**
- JWT tokens for stateless authentication
- CORS configured for localhost
- Pydantic validation on all inputs
- Environment variables protect credentials
- No hardcoded secrets in code
- MongoDB credentials in `.env` (ignored by git)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Ensure MongoDB is running or check `MONGO_URI` in `.env` |
| Port 8000 in use | Change port: `--port 8001` |
| Port 3000 in use | `npm run dev -- -p 3001` |
| Module not found (backend) | Run `pip install -r requirements.txt` |
| Module not found (frontend) | Run `npm install` |
| API calls failing | Verify backend running on port 8000, check `NEXT_PUBLIC_API_BASE_URL` |
| Clear localStorage | Run in browser console: `localStorage.clear(); location.reload();` |

## License

Licensed under the **MIT License** - see [LICENSE](./LICENSE) file for details.

MIT License allows free use, modification, and distribution. See LICENSE file for full terms.

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push branch: `git push origin feature/new-feature`
5. Open Pull Request

## Support

- Check [Troubleshooting](#-troubleshooting) section
- Review [Security](#-security) documentation
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production setup
- Review [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) for security details

---

**Version**: 1.0.0 | **Last Updated**: October 2025

