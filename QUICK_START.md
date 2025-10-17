# Quick Start Guide - Running Your Todo App

## 🚀 Quick Setup (Copy & Paste)

### **Terminal 1 - Backend**

```powershell
cd C:\Users\richp\OneDrive\Documents\todo-app\backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Wait for this message:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

### **Terminal 2 - Frontend**

```powershell
cd C:\Users\richp\OneDrive\Documents\todo-app\frontend
npm install
npm run dev
```

**Wait for this message:**
```
✓ Ready in X.Xs
Local:        http://localhost:3001 (or 3002, 3003...)
```

---

## 🌐 Access Your App

| Component | URL | Purpose |
|-----------|-----|---------|
| **Frontend** | http://localhost:3001 | Main app (login, dashboard, affirmations) |
| **Backend API** | http://localhost:8000 | REST API |
| **Swagger Docs** | http://localhost:8000/docs | API testing |
| **ReDoc** | http://localhost:8000/redoc | API documentation |

---

## ✅ Verify Everything is Working

### **1. Check Backend Health**
Open: http://localhost:8000/

Should see:
```json
{"message":"Hello, FastAPI!","status":"healthy"}
```
✅ Backend is running!

### **2. Check Swagger API Docs**
Open: http://localhost:8000/docs

Should see Swagger UI with all endpoints
✅ API is accessible!

### **3. Check Frontend**
Open: http://localhost:3001 (or the port shown in terminal)

Should see Login page
✅ Frontend is running!

---

## 📝 Complete Test Workflow

### **Step 1: Sign Up**
1. Open frontend: http://localhost:3001
2. Click "Sign Up" or go to signup page
3. Enter:
   ```
   Username: john_doe
   Email: john@example.com
   Password: password123
   ```
4. Click "Sign Up"
5. Should see: ✅ **Account created successfully**

### **Step 2: Login**
1. Enter credentials:
   ```
   Email: john@example.com
   Password: password123
   ```
2. Click "Login"
3. Should see: ✅ **Dashboard with your tasks**

### **Step 3: Try Affirmations**
1. Click the **🙏 Affirmations** icon in bottom navigation
2. Should see a beautiful affirmation
3. Click "New Affirmation" button
4. Should get a different affirmation each time
5. ✅ **Affirmations working!**

### **Step 4: Create a Task**
1. Click "Home" or go to Dashboard
2. Click "+ Add Task" or similar
3. Enter:
   ```
   Title: My First Task
   Description: Testing the app
   Priority: High
   Deadline: 2025-02-15
   ```
4. Click "Create"
5. Should see: ✅ **Task appears on dashboard**

---

## 🧪 Test API with Swagger

1. Open: http://localhost:8000/docs
2. Try `/signup`:
   - Click "Try it out"
   - Use example values (they're pre-filled)
   - Click "Execute"
   - Should see: ✅ **200 OK**

3. Try `/login`:
   - Click "Try it out"
   - Use your credentials
   - Click "Execute"
   - Should see: ✅ **200 OK + access_token**

4. Try Protected Endpoint:
   - Copy `access_token` from login response
   - Click "Authorize" button (🔓)
   - Paste: `Bearer <your_token_here>`
   - Now try `/api/tasks` GET
   - Should see: ✅ **200 OK + your tasks**

---

## 🛑 Troubleshooting

### **Issue: "Cannot access localhost:3001"**
- Make sure frontend is running (check terminal 2)
- Try the port shown in terminal (might be 3002 or 3003)
- Wait 10-15 seconds for it to start

### **Issue: "Cannot access localhost:8000/docs"**
- Make sure backend is running (check terminal 1)
- Wait for "Application startup complete"
- Try: http://localhost:8000 (health check)
- If health check works, API is running

### **Issue: "Backend not connecting"**
- Check Frontend API URL: `frontend/utils/api.ts` line 1
- Should be: `const API_BASE_URL = 'http://localhost:8000';`
- Restart frontend after checking

### **Issue: "Cannot signup - getting error"**
- Check Swagger first: http://localhost:8000/docs
- Try signup there to see exact error
- Common issues:
  - ❌ Password too short (min 6 chars)
  - ❌ Password too long (max 72 bytes)
  - ❌ Email invalid format
  - ❌ Email already registered

### **Issue: "MongoDB connection error"**
- Make sure MongoDB is running
- Windows: Start MongoDB service
- Linux/Mac: `mongod` in terminal
- Check connection: http://localhost:8000/
- If health check works, DB is connected

---

## 📋 Requirements Checklist

- ✅ Python 3.10+ installed
- ✅ Node.js 16+ installed
- ✅ MongoDB running (local or cloud)
- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed

---

## 🎯 Port Summary

| Port | Service | Status |
|------|---------|--------|
| 8000 | Backend (FastAPI) | Change in requirements if needed |
| 3001/3002/3003 | Frontend (Next.js) | Auto-increment if port busy |
| 27017 | MongoDB | Required for data storage |

---

## 📞 Quick Commands Reference

```powershell
# Backend - Activate virtual environment
.\venv\Scripts\Activate.ps1

# Backend - Install dependencies
pip install -r requirements.txt

# Backend - Run with reload (for development)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Backend - Run without reload (for production)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Frontend - Install dependencies
npm install

# Frontend - Run development server
npm run dev

# Frontend - Build for production
npm run build
npm start
```

---

## ✨ Everything Ready!

Once you see both:
1. Backend: "Application startup complete"
2. Frontend: "Ready in X.Xs"

**Your app is ready to use!** 🎉

Open http://localhost:3001 and start creating tasks!
