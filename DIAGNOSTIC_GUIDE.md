# Diagnostic & Troubleshooting Guide

## 🔍 Current Status Check

### **Backend Status**
```
Port 8000: ✅ LISTENING (Process ID: 3272)
Status: Backend IS Running!
```

### **Frontend Status**
```
Port 3001/3002/3003: ❌ NOT RUNNING
Status: Frontend needs to be started
```

---

## 🚀 What to Do Right Now

### **Step 1: Start Backend (if not already running)**

Open **PowerShell** and run:
```powershell
cd C:\Users\richp\OneDrive\Documents\todo-app\backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Wait for:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### **Step 2: Start Frontend (MUST BE IN NEW TERMINAL)**

Open **Another PowerShell** and run:
```powershell
cd C:\Users\richp\OneDrive\Documents\todo-app\frontend
npm run dev
```

Wait for:
```
✓ Ready in X.Xs
Local:        http://localhost:3001 (or 3002)
```

---

## ✅ Verification Checklist

After both are running, verify:

### **1. Backend Health Check**
Open browser: **http://localhost:8000/**

Should see:
```json
{"message":"Hello, FastAPI!","status":"healthy"}
```
✅ If yes → Backend working!
❌ If no → Backend not running, check terminal for errors

### **2. Swagger API Docs**
Open browser: **http://localhost:8000/docs**

Should see:
- Swagger UI interface
- List of endpoints (/signup, /login, /api/tasks, etc.)
- "Try it out" buttons

✅ If yes → Swagger working!
❌ If no → Backend crashed, restart it

### **3. Frontend App**
Open browser: **http://localhost:3001** (or whatever port terminal says)

Should see:
- Login page with username/email/password fields
- Sign Up button or link

✅ If yes → Frontend working!
❌ If no → Frontend not running, check terminal for errors

---

## 🧪 Complete Test Sequence

### **Test 1: Backend API**
1. Open http://localhost:8000/docs
2. Find `/signup` endpoint
3. Click "Try it out"
4. Use example values (pre-filled)
5. Click "Execute"
6. Should see: ✅ **200 OK**

### **Test 2: Frontend Login**
1. Open http://localhost:3001
2. Should see login form
3. Click "Sign Up" or similar
4. Create account with:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
5. Should see: ✅ **Account created message**

### **Test 3: Dashboard & Affirmations**
1. Login with created account
2. Should see: Dashboard with tasks
3. Click 🙏 icon (bottom navigation)
4. Should see: ✅ **Affirmations page with quote**
5. Click "New Affirmation"
6. Should see: ✅ **Different affirmation**

---

## 🛑 Troubleshooting

### **Problem: "Cannot access http://localhost:8000"**
**Solution:**
1. Check backend terminal is showing "Application startup complete"
2. Try: http://localhost:8000/ (just root)
3. If that fails, backend crashed
4. Check terminal for error messages
5. Restart backend

### **Problem: "Cannot access http://localhost:3001"**
**Solution:**
1. Check frontend terminal showing "Ready in X.Xs"
2. Port might be different (3002, 3003, etc.)
3. Check terminal output for actual port
4. Frontend might not have started, restart it
5. Make sure you're in a SEPARATE terminal window

### **Problem: "Swagger gives blank page"**
**Solution:**
1. You're on wrong URL
2. Try: http://localhost:8000/docs (not just /)
3. Backend must be running
4. Try health check first: http://localhost:8000/
5. If health check fails, restart backend

### **Problem: "Frontend shows blank page or error"**
**Solution:**
1. Check browser console (F12) for errors
2. Check frontend terminal for build errors
3. Try a hard refresh: Ctrl+Shift+Delete then F5
4. Frontend API URL must be http://localhost:8000
5. Check: frontend/utils/api.ts line 1
6. Restart frontend: Ctrl+C in terminal, then npm run dev

### **Problem: "Cannot signup - getting errors"**
**Solution:**
1. Test in Swagger first: http://localhost:8000/docs
2. Use Swagger to see exact error
3. Common issues:
   - Password too short (min 6 chars)
   - Password too long (max 72 bytes)
   - Invalid email format
   - Email already registered

### **Problem: "Affirmations not showing"**
**Solution:**
1. You must be logged in first
2. Check that you can see dashboard
3. Click the 🙏 icon in bottom navigation
4. If nothing happens, check browser console (F12)
5. Make sure backend is running

---

## 📋 Port Reference

| Port | Service | Status | What To Do |
|------|---------|--------|-----------|
| 8000 | Backend API | Should be LISTENING | Must run: `uvicorn app.main:app --port 8000 --reload` |
| 3001/3002 | Frontend App | Should be LISTENING | Must run: `npm run dev` |
| 27017 | MongoDB | Should be LISTENING | Must run MongoDB locally or use cloud |

---

## 🔧 Quick Diagnostics

### **Check what's running:**
```powershell
# Check port 8000
netstat -ano | findstr "8000"

# Check port 3001
netstat -ano | findstr "3001"

# Check MongoDB
netstat -ano | findstr "27017"
```

### **Kill a service if stuck:**
```powershell
# Kill backend on 8000
taskkill /F /PID 3272

# Kill frontend
taskkill /F /IM node.exe

# Kill MongoDB
taskkill /F /IM mongod.exe
```

---

## ✨ Correct Startup Sequence

**Terminal 1 (Backend):**
```
1. cd backend
2. .\venv\Scripts\Activate.ps1
3. python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
4. Wait for "Application startup complete"
```

**Terminal 2 (Frontend):**
```
1. cd frontend
2. npm run dev
3. Wait for "Ready in X.Xs"
```

**Then test:**
- Backend: http://localhost:8000/
- Swagger: http://localhost:8000/docs
- Frontend: http://localhost:3001

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ Backend terminal shows: "Application startup complete"
2. ✅ Frontend terminal shows: "Ready in X.Xs"
3. ✅ http://localhost:8000/ returns JSON response
4. ✅ http://localhost:8000/docs shows Swagger UI
5. ✅ http://localhost:3001 shows login page
6. ✅ You can signup, login, and see dashboard
7. ✅ Click Affirmations icon and see spiritual affirmation
8. ✅ Affirmations change when you click "New Affirmation"

**When ALL of these are true, your app is fully working!** 🎉
