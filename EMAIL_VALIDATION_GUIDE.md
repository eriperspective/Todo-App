# Email Validation Guide

## ❌ Why You're Getting "Invalid email format" Error

The backend requires emails to have:
1. An `@` symbol (to separate username from domain)
2. A dot `.` in the domain part (after the `@`)

---

## ✅ Valid Email Formats

| Email | Valid? | Reason |
|-------|--------|--------|
| `john@example.com` | ✅ | Has @ and . in domain |
| `user.name@domain.co.uk` | ✅ | Has @ and . in domain |
| `test123@company.org` | ✅ | Has @ and . in domain |
| `alice@gmail.com` | ✅ | Has @ and . in domain |
| `bob@localhost.local` | ✅ | Has @ and . in domain |

---

## ❌ Invalid Email Formats

| Email | Valid? | Why it fails |
|-------|--------|-------------|
| `string` | ❌ | No @ symbol (Swagger UI default) |
| `john` | ❌ | No @ symbol |
| `john@example` | ❌ | No dot in domain (missing `.` after @) |
| `@example.com` | ❌ | No username before @ |
| `john@` | ❌ | No domain after @ |
| ` ` (space) | ❌ | Empty string |

---

## 🔍 Validation Logic

**Backend validation code:**
```python
if not user.email or '@' not in user.email or '.' not in user.email.split('@')[-1]:
    raise HTTPException(status_code=400, detail="Invalid email format")
```

**What this checks:**
1. ✓ Email is not empty: `if not user.email`
2. ✓ Email contains @: `'@' not in user.email`
3. ✓ Domain has dot: `'.' not in user.email.split('@')[-1]`

---

## 🐛 Common Mistakes

### ❌ Mistake 1: Using "string" from Swagger UI
When testing via FastAPI Swagger UI (`/docs`), the default placeholder is literally `"string"`:
- **Don't use:** `string`
- **Use instead:** `test@example.com`

### ❌ Mistake 2: Forgot the dot in domain
- **Don't use:** `john@localhost`
- **Use instead:** `john@localhost.local` or `john@example.com`

### ❌ Mistake 3: Missing the @
- **Don't use:** `john.example.com`
- **Use instead:** `john@example.com`

### ❌ Mistake 4: Using @ but no domain
- **Don't use:** `john@`
- **Use instead:** `john@example.com`

---

## 📝 How to Test Signup

### Option 1: Frontend Form (RECOMMENDED) ✅
```
Go to: http://localhost:3000/signup

Fill in:
- Username: john_doe
- Email: john@example.com  ← ✅ CORRECT FORMAT
- Password: password123

Click: Create Account
```

### Option 2: Python Test Script
```bash
python test_signup.py
```
Uses: `test@example.com` (correct format)

### Option 3: Swagger UI (Be Careful!)
```
1. Go to: http://localhost:8000/docs
2. Find: /signup endpoint
3. Click: "Try it out"
4. CLEAR the default values
5. Enter valid values:
   {
     "username": "john_doe",
     "email": "john@example.com",  ← ✅ CORRECT FORMAT
     "password": "password123"
   }
6. Click: Execute
```

---

## 🧪 Test Different Valid Emails

Try these test emails:

```python
# All of these are VALID
test_emails = [
    "user@example.com",
    "john.doe@company.co.uk",
    "alice123@test.org",
    "bob_smith@domain.io",
    "contact@mysite.com",
]
```

---

## ✅ Quick Fix Checklist

If you get **"Invalid email format"** error:

- [ ] Email has `@` symbol? 
- [ ] Email has `.` in the domain (after `@`)?
- [ ] No spaces in the email?
- [ ] Not using default "string" placeholder?
- [ ] Format: `username@domain.extension`?

If all ✓, your email should work!

---

## Example Success

**Valid signup request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "user_id": "68f1bebbd7b3fc92f9075ea9",
  "message": "User created successfully"
}
```

**Status:** `200 OK` ✅

---

## Need Help?

If you're still getting errors:

1. **Double-check the email format** - must have @ and . in domain
2. **Check browser console** - see what's being sent
3. **Use the test script** - `python test_signup.py`
4. **Check backend logs** - look for `[SIGNUP DEBUG]` messages
