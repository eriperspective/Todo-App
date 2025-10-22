MongoDB Integration for FastAPI Backend

This backend connects to MongoDB Atlas using `pymongo`. It stores user data from the `/signup` route in the `todo-app` database under the `users` collection.

---

Tech Stack

- MongoDB Atlas — Cloud-hosted NoSQL database
- pymongo — Python driver for MongoDB
- FastAPI — Web framework for handling requests
- dotenv — Loads environment variables from `.env`

---

Environment Setup

Create a `.env` file in the `backend` folder with your MongoDB URI:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/todo-app?retryWrites=true&w=majority

How It Works
app/database.py connects to MongoDB using MongoClient

The users_collection is initialized from the todo-app database

The /signup route inserts new users into the users collection

Relevant Files
backend/
├── app/
│   ├── database.py      # MongoDB connection logic
│   ├── main.py          # FastAPI app with signup route
├── .env                 # Contains MONGO_URI (excluded from Git)

Example Signup Request
POST /signup
Request Body:
{
  "username": "username",
  "email": "example@example.com",
  "password": "password"
}

Response:
{
  "message": "User name saved to MongoDB!",
  "user_id": "..."
}

Verifying in MongoDB Atlas
1. Log into MongoDB Atlas

2. Navigate to your todo-app database

3. Open the users collection

4. You’ll see your registered users with fields like _id, username, email, and password

Testing
Use Swagger UI at http://127.0.0.1:8000/docs or Postman to test the /signup route.

Contributing
Pull requests are welcome! For major changes, open an issue first to discuss improvements.

License
This project is licensed under the MIT License.
