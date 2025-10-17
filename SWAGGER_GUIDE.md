# Swagger API Guide - Complete Testing Instructions

## 🚀 Accessing Swagger

Open: **http://localhost:5000/docs**

---

## 📝 Testing Endpoints

### **1. POST /signup - Create New User**

**How to Test:**
1. Click on the `/signup` endpoint
2. Click "Try it out"
3. Use these example values:
   ```json
   {
     "username": "john_doe",
     "email": "john@example.com",
     "password": "secure_password_123"
   }
   ```
4. Click "Execute"
5. Should see **200 OK** with `user_id`

**Common 400 Errors:**
- ❌ `"Invalid email format"` - Email must have @ and domain
- ❌ `"Password must be at least 6 characters"` - Password too short
- ❌ `"Username must be at least 3 characters"` - Username too short
- ❌ `"Email already registered"` - Email already exists

---

### **2. POST /login - Get Authentication Token**

**How to Test:**
1. Click on the `/login` endpoint
2. Click "Try it out"
3. Use example values:
   ```json
   {
     "email": "john@example.com",
     "password": "secure_password_123"
   }
   ```
4. Click "Execute"
5. Should see **200 OK** with `access_token`

**What You Get:**
```json
{
  "access_token": "eyJhbGc...",
  "user_id": "507f1f77bcf86cd799439011",
  "message": "Login successful"
}
```

---

### **3. Using the JWT Token for Protected Endpoints**

All other endpoints require authentication!

**Steps:**
1. First, login using `/login` endpoint (see above)
2. Copy the `access_token` value
3. Click the "Authorize" button (🔓 lock icon at top of Swagger)
4. Paste token in the "Value" field: `Bearer <your_token_here>`
5. Click "Authorize"
6. Now you can test protected endpoints

---

## 📋 API Endpoints Reference

### **Authentication Endpoints**

#### **POST /signup**
- **Description**: Create new user account
- **Auth Required**: ❌ No
- **Body Parameters**:
  - `username` (string) - Min 3 characters
  - `email` (string) - Valid email format
  - `password` (string) - Min 6 characters

#### **POST /login**
- **Description**: Get JWT authentication token
- **Auth Required**: ❌ No
- **Body Parameters**:
  - `email` (string) - Registered email
  - `password` (string) - User password
- **Returns**: `access_token` for use in other endpoints

#### **POST /logout**
- **Description**: Logout (optional)
- **Auth Required**: ❌ No
- **Returns**: Confirmation message

---

### **Task Endpoints**

#### **GET /api/tasks**
- **Description**: Get all user tasks
- **Auth Required**: ✅ Yes
- **Returns**: List of tasks

#### **POST /api/tasks**
- **Description**: Create new task
- **Auth Required**: ✅ Yes
- **Body Example**:
  ```json
  {
    "title": "Complete project",
    "description": "Finish the todo app",
    "priority": "High",
    "deadline": "2025-01-31T23:59:00",
    "labels": ["work", "urgent"],
    "completed": false
  }
  ```

#### **PUT /api/tasks/{task_id}**
- **Description**: Update task (NOW FIXED!)
- **Auth Required**: ✅ Yes
- **Body Example**:
  ```json
  {
    "title": "Updated title",
    "completed": true,
    "priority": "Medium"
  }
  ```
- **Note**: Only include fields you want to update

#### **DELETE /api/tasks/{task_id}**
- **Description**: Delete task
- **Auth Required**: ✅ Yes

---

### **Label Endpoints**

#### **GET /api/labels**
- **Description**: Get all user labels
- **Auth Required**: ✅ Yes

#### **POST /api/labels**
- **Description**: Create label
- **Auth Required**: ✅ Yes
- **Body Example**:
  ```json
  {
    "name": "urgent"
  }
  ```

#### **PATCH /api/tasks/{task_id}/labels**
- **Description**: Assign labels to task (NOW FIXED!)
- **Auth Required**: ✅ Yes
- **Body Example**:
  ```json
  {
    "labels": ["work", "urgent", "frontend"]
  }
  ```

---

## ⚠️ Common Issues & Solutions

### **Issue: 400 Bad Request on /signup**
**Cause**: Invalid test data (e.g., "string" as email)
**Solution**: Use the example values provided above
- ✅ Email must include @ and domain: `user@example.com`
- ✅ Password must be 6+ characters: `password123`
- ✅ Username must be 3+ characters: `john_doe`

### **Issue: 401 Unauthorized on protected endpoints**
**Cause**: Missing or invalid authentication token
**Solution**: 
1. Login first with `/login`
2. Copy the `access_token`
3. Click "Authorize" button
4. Paste: `Bearer <token_here>`

### **Issue: 422 Unprocessable Entity (FIXED!)**
**Previous Cause**: Invalid request body structure
**Status**: ✅ All endpoints now have proper Pydantic validation

---

## 🧪 Complete Test Workflow

### **Step 1: Create Account**
```
POST /signup
{
  "username": "test_user",
  "email": "test@example.com",
  "password": "password123"
}
```
✅ Response: `{"user_id": "...", "message": "User created successfully"}`

### **Step 2: Login**
```
POST /login
{
  "email": "test@example.com",
  "password": "password123"
}
```
✅ Response: `{"access_token": "...", "user_id": "...", "message": "Login successful"}`

### **Step 3: Authorize (Copy token from Step 2)**
- Click "Authorize" button
- Paste: `Bearer eyJhbGc...`
- Click "Authorize"

### **Step 4: Create Task**
```
POST /api/tasks
{
  "title": "My First Task",
  "description": "Test task",
  "priority": "High",
  "deadline": "2025-02-15T17:00:00"
}
```
✅ Response: `{"task_id": "...", "message": "Task created successfully"}`

### **Step 5: Get All Tasks**
```
GET /api/tasks
```
✅ Response: Array of all user tasks

### **Step 6: Update Task**
```
PUT /api/tasks/{task_id}
{
  "completed": true,
  "priority": "Low"
}
```
✅ Response: `{"message": "Task updated"}`

### **Step 7: Delete Task**
```
DELETE /api/tasks/{task_id}
```
✅ Response: `{"message": "Task deleted"}`

---

## ✅ Status Summary

| Endpoint | Status | Notes |
|----------|--------|-------|
| POST /signup | ✅ Working | Use valid email format |
| POST /login | ✅ Working | Returns JWT token |
| GET /api/tasks | ✅ Working | Requires auth |
| POST /api/tasks | ✅ Working | Requires auth |
| PUT /api/tasks/{id} | ✅ FIXED | Now validates properly |
| DELETE /api/tasks/{id} | ✅ Working | Requires auth |
| POST /api/labels | ✅ Working | Requires auth |
| GET /api/labels | ✅ Working | Requires auth |
| PATCH /api/tasks/{id}/labels | ✅ FIXED | Now validates properly |

---

## 🎯 Pro Tips

1. **Copy Example Data**: Use the example values provided in Swagger instead of generic strings
2. **Check Error Messages**: Error responses explain exactly what went wrong
3. **Keep Token Handy**: Authorize once, then test all protected endpoints
4. **Monitor Terminal**: Check backend terminal for [DEBUG] messages if errors occur
5. **Test Real Emails**: Use realistic email formats when testing

---

## 🚨 If You Still Get Errors

1. **Check Backend Terminal** - Look for [SIGNUP DEBUG] or error messages
2. **Verify MongoDB** - Is MongoDB running? Check: `netstat -ano | findstr 27017`
3. **Check Token Expiry** - JWT tokens might expire, re-login if needed
4. **Clear Browser Cache** - Ctrl+Shift+Delete and clear cache
5. **Restart Backend** - Kill and restart the Python uvicorn server

**Everything is now working properly!** Try the complete workflow above! 🎉
